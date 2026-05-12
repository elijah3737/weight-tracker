import { useState, useEffect } from 'react';
import Today from './screens/Today';
import Month from './screens/Month';
import Progress from './screens/Progress';
import { initTelegram, isTelegram, getTelegramUser } from './lib/telegram';

const tabs = [
  { id: 'today', label: 'Сегодня', icon: '📋' },
  { id: 'month', label: 'Месяц', icon: '📅' },
  { id: 'progress', label: 'Прогресс', icon: '📈' },
];

export default function App() {
  const [tab, setTab] = useState('today');
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    initTelegram();
    const user = getTelegramUser();
    if (user) setTgUser(user);
  }, []);

  const userName = tgUser?.first_name ?? 'Аня';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-sm bg-gray-100 relative">
        {/* Status bar — скрываем внутри Telegram (там своя шапка) */}
        {!isTelegram() && (
          <div className="bg-white px-4 pt-3 pb-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <span className="text-xs text-gray-400">9:41</span>
            <span className="text-sm font-semibold text-gray-700">fit+ трекер</span>
            <span className="text-xs text-gray-400">⚡ 87%</span>
          </div>
        )}

        {/* Content */}
        <div className={tab === 'chat' ? '' : 'overflow-y-auto'} style={tab === 'chat' ? {} : { height: 'calc(100dvh - 104px)' }}>
          {tab === 'today' && <Today />}
          {tab === 'month' && <Month />}
          {tab === 'progress' && <Progress />}
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 flex z-10">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
                tab === t.id ? 'text-purple-600' : 'text-gray-400'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span className="text-[10px] font-medium leading-tight">{t.label}</span>
              {tab === t.id && <div className="w-1 h-1 rounded-full bg-purple-500" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
