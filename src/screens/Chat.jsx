import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Settings } from 'lucide-react';
import { chat, SYSTEM_PROMPT, isConfigured } from '../lib/ollama';

const SUGGESTIONS = [
  'Можно ли есть после 18:00?',
  'Почему вес стоит уже 4 дня?',
  'Что поесть на ужин до 500 ккал?',
  'Я сорвалась, съела торт 😔',
  'Как выйти из плато?',
  'Считай норму воды для меня',
];

export default function Chat({ onGoSettings }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Привет! Я Вита, твой AI-коуч 👋\n\nМогу ответить на вопросы по питанию, помочь с планом на день или поддержать если что-то пошло не так. Спрашивай!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');
    setError('');

    const userMsg = { role: 'user', content };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    // placeholder for streaming
    setMessages(m => [...m, { role: 'assistant', content: '', streaming: true }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.role, content: m.content })),
      ];

      await chat(apiMessages, {
        signal: controller.signal,
        onChunk: (full) => {
          setMessages(m => m.map((msg, i) =>
            i === m.length - 1 ? { ...msg, content: full } : msg
          ));
        },
      });
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(e.message);
      setMessages(m => m.filter((_, i) => i !== m.length - 1));
    } finally {
      setMessages(m => m.map(msg => ({ ...msg, streaming: false })));
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (!isConfigured()) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center pb-24 pt-16">
        <div className="text-5xl mb-4">🤖</div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">AI не подключён</h3>
        <p className="text-sm text-gray-400 mb-6">Укажи URL и токен Ollama-сервера в настройках чтобы чат заработал</p>
        <button
          onClick={onGoSettings}
          className="flex items-center gap-2 bg-purple-500 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-purple-600 transition-colors"
        >
          <Settings size={16} /> Открыть настройки
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 104px)' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === 'user' ? 'bg-purple-100' : 'bg-gradient-to-br from-purple-400 to-purple-600'
            }`}>
              {msg.role === 'user'
                ? <User size={14} className="text-purple-600" />
                : <Bot size={14} className="text-white" />}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-purple-500 text-white rounded-tr-sm'
                : 'bg-white text-gray-700 rounded-tl-sm shadow-sm'
            }`}>
              {msg.content || (msg.streaming && <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>)}
            </div>
          </div>
        ))}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm text-red-600">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-2 text-center">Попробуй спросить:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-3 py-3 mb-16">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            placeholder="Напиши вопрос..."
            value={input}
            onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
            onKeyDown={handleKey}
            className="flex-1 border border-gray-200 rounded-2xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-400 overflow-hidden"
            style={{ minHeight: '40px' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
              input.trim() && !loading
                ? 'bg-purple-500 hover:bg-purple-600 shadow-md shadow-purple-200'
                : 'bg-gray-100'
            }`}
          >
            <Send size={16} className={input.trim() && !loading ? 'text-white' : 'text-gray-300'} />
          </button>
        </div>
      </div>
    </div>
  );
}
