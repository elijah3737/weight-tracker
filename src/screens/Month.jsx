import { useState } from 'react';
import { monthData } from '../data/mockData';

const DOW = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function effColor(eff) {
  if (eff === null) return 'bg-gray-100 text-gray-300';
  if (eff >= 70) return 'bg-green-400 text-white';
  if (eff >= 40) return 'bg-yellow-400 text-white';
  return 'bg-red-400 text-white';
}

function effLabel(eff) {
  if (eff === null) return '—';
  if (eff >= 70) return '🟢';
  if (eff >= 40) return '🟡';
  return '🔴';
}

export default function Month() {
  const [selected, setSelected] = useState(null);

  // May 2026 starts on Friday (index 4 in Mon-based week)
  const startOffset = 4;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  monthData.forEach(d => cells.push(d));

  const filled = monthData.filter(d => d.eff !== null);
  const avg = filled.length ? Math.round(filled.reduce((s, d) => s + d.eff, 0) / filled.length) : 0;
  const best = filled.reduce((b, d) => d.eff > (b?.eff ?? 0) ? d : b, null);

  const habitStats = [
    { name: '💧 Вода', done: 9, total: 9 },
    { name: '😴 Сон', done: 4, total: 9 },
    { name: '🏋️ Тренировки', done: 1, total: 9 },
  ];

  const problems = [
    { name: '☕ Кофе после 16:00', count: 13 },
    { name: '🍕 Еда без подсчётов', count: 5 },
  ];

  return (
    <div className="pb-24">
      <div className="bg-white px-4 py-5 mb-2">
        <h2 className="text-base font-bold text-gray-800 mb-4">Май 2026</h2>

        {/* DOW header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DOW.map(d => (
            <div key={d} className="text-center text-xs text-gray-400 font-medium">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`e${i}`} />;
            const isSel = selected?.day === cell.day;
            return (
              <button
                key={cell.day}
                onClick={() => setSelected(isSel ? null : cell)}
                className={`aspect-square rounded-xl text-sm font-bold flex items-center justify-center transition-all
                  ${cell.eff === null ? 'bg-gray-100 text-gray-300' : ''}
                  ${cell.eff !== null && cell.eff >= 70 ? 'bg-green-400 text-white' : ''}
                  ${cell.eff !== null && cell.eff >= 40 && cell.eff < 70 ? 'bg-yellow-400 text-white' : ''}
                  ${cell.eff !== null && cell.eff < 40 ? 'bg-red-400 text-white' : ''}
                  ${isSel ? 'ring-2 ring-purple-500 scale-110' : ''}
                `}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3 justify-center text-xs text-gray-400">
          <span>🟢 &gt;70%</span>
          <span>🟡 40–70%</span>
          <span>🔴 &lt;40%</span>
          <span className="text-gray-300">⬜ нет данных</span>
        </div>
      </div>

      {/* Day detail */}
      {selected && (
        <div className="bg-purple-50 border border-purple-200 mx-4 rounded-2xl p-4 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-purple-700">{selected.day} мая</span>
            <span className="text-lg">{effLabel(selected.eff)}</span>
          </div>
          {selected.eff !== null ? (
            <>
              <div className="text-2xl font-bold text-purple-600">{selected.eff}%</div>
              <div className="text-xs text-gray-500 mt-1">эффективность дня</div>
            </>
          ) : (
            <div className="text-sm text-gray-400">Нет данных за этот день</div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white px-4 py-5 mb-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">📊 Май — итоги</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-purple-600">{avg}%</div>
            <div className="text-xs text-gray-400 mt-1">средний результат</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-green-600">{best?.day ?? '—'}</div>
            <div className="text-xs text-gray-400 mt-1">лучший день мая</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{filled.length}</div>
            <div className="text-xs text-gray-400 mt-1">дней заполнено</div>
          </div>
        </div>

        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">🏆 Топ привычек</h4>
        <div className="space-y-2 mb-4">
          {habitStats.map(h => (
            <div key={h.name} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{h.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-green-400 h-1.5 rounded-full"
                    style={{ width: `${(h.done / h.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">{h.done}/{h.total} дн</span>
              </div>
            </div>
          ))}
        </div>

        <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">⚠️ Проблемные зоны</h4>
        <div className="space-y-2">
          {problems.map(p => (
            <div key={p.name} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{p.name}</span>
              <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-semibold">
                {p.count} раз
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
