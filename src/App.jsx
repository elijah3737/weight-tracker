import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, TrendingUp } from 'lucide-react';
import Today from './screens/Today';
import Month from './screens/Month';
import Progress from './screens/Progress';
import { initTelegram, isTelegram, getTelegramUser } from './lib/telegram';

const tabs = [
  { id: 'today', label: 'Сегодня', Icon: ClipboardList },
  { id: 'month', label: 'Месяц', Icon: Calendar },
  { id: 'progress', label: 'Прогресс', Icon: TrendingUp },
];

export default function App() {
  const [tab, setTab] = useState('today');
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    initTelegram();
    const user = getTelegramUser();
    if (user) setTgUser(user);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Status bar — скрываем внутри Telegram */}
      {!isTelegram() && (
        <div className="bg-white px-4 pt-3 pb-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <span className="text-xs text-gray-400">9:41</span>
          <span className="text-sm font-semibold text-gray-700">fit+ трекер</span>
          <span className="text-xs text-gray-400">⚡ 87%</span>
        </div>
      )}

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: isTelegram() ? 'calc(100dvh - 64px)' : 'calc(100dvh - 112px)' }}>
        {tab === 'today' && <Today />}
        {tab === 'month' && <Month />}
        {tab === 'progress' && <Progress />}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-10" style={{ boxShadow: '0 -1px 0 #f0f0f0' }}>
        <div className="flex">
          {tabs.map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 transition-colors relative"
              >
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-purple-500 rounded-full" />
                )}
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-purple-600' : 'text-gray-400'}
                />
                <span className={`text-[10px] font-medium leading-tight ${active ? 'text-purple-600' : 'text-gray-400'}`}>
                  {label}
                </span>
                <div className="h-safe-area-inset-bottom" />
              </button>
            );
          })}
        </div>
        {/* Safe area для iPhone */}
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </div>
  );
}
