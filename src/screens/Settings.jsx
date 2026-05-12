import { useState } from 'react';
import { Check, Eye, EyeOff, Wifi, WifiOff } from 'lucide-react';
import { isConfigured } from '../lib/ollama';

const MODELS = ['llama3', 'llama3.1', 'llama3.2', 'mistral', 'gemma2', 'qwen2.5', 'deepseek-r1'];

export default function Settings() {
  const [url, setUrl] = useState(localStorage.getItem('ollama_url') || '');
  const [token, setToken] = useState(localStorage.getItem('ollama_token') || '');
  const [model, setModel] = useState(localStorage.getItem('ollama_model') || 'llama3');
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | 'ok' | 'error'
  const [testMsg, setTestMsg] = useState('');

  const save = () => {
    localStorage.setItem('ollama_url', url.trim());
    localStorage.setItem('ollama_token', token.trim());
    localStorage.setItem('ollama_model', model);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const test = async () => {
    if (!url.trim()) { setTestResult('error'); setTestMsg('Укажи URL'); return; }
    setTesting(true);
    setTestResult(null);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token.trim()) headers['Authorization'] = `Bearer ${token.trim()}`;
      const res = await fetch(`${url.trim().replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'ping' }],
          stream: false,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        setTestResult('ok');
        setTestMsg('Соединение успешно!');
      } else {
        setTestResult('error');
        setTestMsg(`Ошибка ${res.status}`);
      }
    } catch (e) {
      setTestResult('error');
      setTestMsg(e.message.includes('timeout') ? 'Таймаут — сервер не отвечает' : e.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="bg-white px-4 py-5 mb-2">
        <h2 className="text-base font-bold text-gray-800 mb-1">⚙️ Настройки AI</h2>
        <p className="text-xs text-gray-400 mb-4">Подключи свой Ollama-сервер для работы AI-коуча и разбора еды</p>

        {/* Status badge */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-4 text-sm ${
          isConfigured() ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {isConfigured()
            ? <><Wifi size={15} /> AI подключён</>
            : <><WifiOff size={15} /> AI не настроен</>}
        </div>

        {/* URL */}
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            URL сервера Ollama
          </label>
          <input
            type="url"
            placeholder="https://ollama.yourserver.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400"
          />
          <p className="text-xs text-gray-400 mt-1">Например: http://192.168.1.10:11434</p>
        </div>

        {/* Token */}
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            API токен (если есть)
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              placeholder="sk-..."
              value={token}
              onChange={e => setToken(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={() => setShowToken(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Оставь пустым если Ollama без авторизации</p>
        </div>

        {/* Model */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            Модель
          </label>
          <div className="flex flex-wrap gap-2">
            {MODELS.map(m => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  model === m
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="или введи своё название модели"
            value={MODELS.includes(model) ? '' : model}
            onChange={e => setModel(e.target.value || 'llama3')}
            className="w-full mt-2 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Test result */}
        {testResult && (
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 text-sm ${
            testResult === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {testResult === 'ok' ? '✅' : '❌'} {testMsg}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={test}
            disabled={testing}
            className="flex-1 py-3 rounded-xl border-2 border-purple-200 text-purple-600 font-semibold text-sm hover:bg-purple-50 transition-colors disabled:opacity-50"
          >
            {testing ? 'Проверяю...' : '🔌 Проверить'}
          </button>
          <button
            onClick={save}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {saved ? <span className="flex items-center justify-center gap-1"><Check size={16} /> Сохранено</span> : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* System prompt info */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">📝 Базовый промт</h3>
        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 font-mono leading-relaxed">
          Ты — AI-коуч по снижению веса. Зовут тебя Вита.<br />
          Отвечаешь по-русски, поддерживаешь, даёшь советы по питанию.<br />
          Знаешь параметры пользователя: вес, цель, нормы КБЖУ.<br />
          При вопросах про еду — называешь калории и БЖУ.
        </div>
      </div>
    </div>
  );
}
