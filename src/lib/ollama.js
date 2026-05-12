const DEFAULT_MODEL = 'llama3';

function getConfig() {
  return {
    url: localStorage.getItem('ollama_url') || '',
    token: localStorage.getItem('ollama_token') || '',
    model: localStorage.getItem('ollama_model') || DEFAULT_MODEL,
  };
}

export function isConfigured() {
  return !!getConfig().url;
}

export async function chat(messages, { onChunk, signal } = {}) {
  const { url, token, model } = getConfig();
  if (!url) throw new Error('Ollama не настроен. Укажи URL в настройках.');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const stream = !!onChunk;

  const res = await fetch(`${url.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({ model, messages, stream }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Ollama ошибка ${res.status}: ${text}`);
  }

  if (!stream) {
    const data = await res.json();
    return data.message?.content ?? '';
  }

  // streaming
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        const chunk = obj.message?.content ?? '';
        full += chunk;
        onChunk(full);
      } catch {}
    }
  }
  return full;
}

export const SYSTEM_PROMPT = `Ты — AI-коуч по снижению веса. Зовут тебя Вита.
Ты помогаешь пользователю выстраивать здоровые привычки, считать калории, следить за прогрессом.

Правила:
- Отвечай по-русски, коротко и по делу
- Не осуждай срывы — поддерживай и помогай вернуться в режим
- Давай конкретные советы, основанные на науке
- При вопросах про еду — называй КБЖУ если знаешь
- Не выходи за рамки темы здорового питания и похудения

Параметры пользователя:
- Имя: Аня
- Вес: 66.4 кг → цель 62 кг
- Норма калорий: 1500 ккал/день
- Норма белка: 120 г/день
- Норма воды: 2.2 л/день`;

export const FOOD_PARSE_PROMPT = `Ты — нутрициолог. Пользователь описал что съел.
Определи блюда и рассчитай КБЖУ. Верни ТОЛЬКО валидный JSON без пояснений:
{"items":[{"name":"...","kcal":0,"protein":0,"fat":0,"carbs":0}],"total":{"kcal":0,"protein":0,"fat":0,"carbs":0}}
Если вес не указан — используй стандартную порцию. Числа только целые.`;
