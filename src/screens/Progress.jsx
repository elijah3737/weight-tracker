import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';
import { profile, weightHistory } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
      <div className="font-semibold text-gray-700">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === 'weight' ? 'Фактический' : 'Прогноз'}: {p.value} кг
        </div>
      ))}
    </div>
  );
};

export default function Progress() {
  const lost = +(profile.weightStart - profile.weightCurrent).toFixed(1);
  const remaining = +(profile.weightCurrent - profile.weightGoal).toFixed(1);
  const pct = Math.round((lost / (profile.weightStart - profile.weightGoal)) * 100);
  const avgDeficit = 187;
  const fatBurned = +((lost * 7700 / 7700)).toFixed(1);

  const chartData = weightHistory.map(d => ({
    date: d.date,
    weight: d.weight,
    forecast: d.forecast ?? (d.weight ?? null),
  }));

  return (
    <div className="pb-24">
      {/* Main metrics */}
      <div className="bg-white px-4 py-5 mb-2">
        <h2 className="text-base font-bold text-gray-800 mb-4">Прогресс похудения</h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">Стартовый вес</div>
            <div className="text-xl font-bold text-gray-600">{profile.weightStart} кг</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">Сейчас</div>
            <div className="text-xl font-bold text-purple-600">{profile.weightCurrent} кг</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">Сброшено</div>
            <div className="text-xl font-bold text-green-600">−{lost} кг</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">До цели</div>
            <div className="text-xl font-bold text-orange-500">{remaining} кг</div>
          </div>
        </div>

        {/* Progress to goal */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{profile.weightStart} кг</span>
            <span className="font-semibold text-purple-600">{pct}% пути</span>
            <span>{profile.weightGoal} кг</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 relative">
            <div
              className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-purple-500 rounded-full shadow"
              style={{ left: `calc(${pct}% - 8px)` }}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white px-4 py-5 mb-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">📈 График веса</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis domain={[61, 69]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={profile.weightGoal} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Цель', position: 'right', fontSize: 10, fill: '#10b981' }} />
            <Line
              dataKey="weight"
              stroke="#a855f7"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#a855f7' }}
              connectNulls={false}
              name="Фактический"
            />
            <Line
              dataKey="forecast"
              stroke="#d8b4fe"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
              name="Прогноз"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional stats */}
      <div className="bg-white px-4 py-5 mb-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">📊 Дополнительная статистика</h3>
        <div className="space-y-3">
          {[
            { icon: '📅', label: 'Начало программы', value: '1 мая 2026' },
            { icon: '🏁', label: 'Прогноз достижения цели', value: `~${profile.forecastDate}` },
            { icon: '🔥', label: 'Средний дефицит', value: `${avgDeficit} ккал/день` },
            { icon: '💪', label: 'Сожжено жира', value: `~${fatBurned} кг` },
            { icon: '📆', label: 'День программы', value: `${profile.daysSinceStart} из ~104` },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-700 mx-4 rounded-2xl p-4 text-white mb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-75 mb-1">Лучший streak</div>
            <div className="text-2xl font-bold">🔥 8 дней</div>
            <div className="text-xs opacity-75 mt-1">по выполнению нормы воды</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-75 mb-1">Текущий streak</div>
            <div className="text-2xl font-bold">5 дней</div>
          </div>
        </div>
      </div>
    </div>
  );
}
