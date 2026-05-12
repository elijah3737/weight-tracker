import { useState } from 'react';
import { Check, Plus, ChevronDown, ChevronUp, Camera, PenLine } from 'lucide-react';
import { todayData, habits as initialHabits, badHabits as initialBad, foodLogs as initialFood, profile } from '../data/mockData';
import AddFoodModal from '../components/AddFoodModal';

function ProgressBar({ value, max, color = 'bg-green-400' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function HabitRow({ habit, onToggle }) {
  return (
    <div
      className="flex items-center justify-between py-3 cursor-pointer select-none"
      onClick={() => onToggle(habit.id)}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{habit.icon}</span>
        <span className={`text-sm font-medium ${habit.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {habit.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold ${habit.points > 0 ? 'text-green-500' : 'text-red-400'}`}>
          {habit.points > 0 ? `+${habit.points}` : habit.points}
        </span>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          habit.done ? 'bg-green-400 border-green-400' : 'border-gray-300'
        }`}>
          {habit.done && <Check size={12} color="white" strokeWidth={3} />}
        </div>
      </div>
    </div>
  );
}

function FoodItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-2">
      <div className="flex items-center justify-between px-3 py-2.5 cursor-pointer" onClick={() => setOpen(v => !v)}>
        <div className="flex items-center gap-2">
          {item.source === 'photo'
            ? <Camera size={14} className="text-purple-400" />
            : <PenLine size={14} className="text-blue-400" />}
          <span className="text-xs text-gray-400">{item.time}</span>
          <span className="text-sm font-medium text-gray-700">{item.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-orange-500">{item.kcal} ккал</span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </div>
      {open && (
        <div className="px-3 pb-3 flex gap-4 text-xs text-gray-500 bg-gray-50">
          <span>🥩 Б: {item.protein}г</span>
          <span>🧈 Ж: {item.fat}г</span>
          <span>🌾 У: {item.carbs}г</span>
        </div>
      )}
    </div>
  );
}

export default function Today() {
  const [habits, setHabits] = useState(initialHabits);
  const [badHabits, setBadHabits] = useState(initialBad);
  const [food, setFood] = useState(initialFood);
  const [showAddFood, setShowAddFood] = useState(false);
  const [waterInput, setWaterInput] = useState('');
  const [water, setWater] = useState(todayData.water);
  const [dayClosed, setDayClosed] = useState(false);
  const [weightInput, setWeightInput] = useState(String(todayData.weight));

  const toggleHabit = (id) => setHabits(h => h.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const toggleBad = (id) => setBadHabits(h => h.map(x => x.id === id ? { ...x, done: !x.done } : x));

  const addWater = () => {
    const v = parseFloat(waterInput);
    if (!isNaN(v) && v > 0) { setWater(w => Math.min(profile.waterNorm, +(w + v).toFixed(1))); setWaterInput(''); }
  };

  const score = habits.filter(h => h.done).reduce((s, h) => s + h.points, 0)
    + badHabits.filter(h => h.done).reduce((s, h) => s + h.points, 0);
  const scoreMax = habits.reduce((s, h) => s + h.points, 0);
  const eff = Math.max(0, Math.round((score / scoreMax) * 100));

  const caloriesTotal = food.reduce((s, f) => s + f.kcal, 0);
  const proteinTotal = food.reduce((s, f) => s + f.protein, 0);

  const foodHabits = habits.filter(h => h.cat === 'food');
  const activityHabits = habits.filter(h => h.cat === 'activity');
  const sleepHabits = habits.filter(h => h.cat === 'sleep');

  return (
    <div className="pb-24">
      {showAddFood && (
        <AddFoodModal
          onClose={() => setShowAddFood(false)}
          onAdd={(item) => setFood(f => [...f, item])}
        />
      )}
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 mb-2">
        <div className="text-xs text-gray-400 mb-1">Вторник, 13 мая</div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-gray-800">{eff}%</span>
            <span className="text-sm text-gray-400 ml-2">эффективность</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-purple-500">{score}</span>
            <span className="text-sm text-gray-400"> / {scoreMax} баллов</span>
          </div>
        </div>
        <ProgressBar value={score} max={scoreMax} color="bg-purple-400" />
      </div>

      {/* Weight */}
      <div className="bg-white px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600">⚖️ Вес</h3>
          <div className="text-sm text-gray-400">
            {parseFloat(weightInput) < todayData.weightYesterday
              ? <span className="text-green-500">↓ {(todayData.weightYesterday - parseFloat(weightInput)).toFixed(1)} кг</span>
              : parseFloat(weightInput) > todayData.weightYesterday
              ? <span className="text-red-400">↑ {(parseFloat(weightInput) - todayData.weightYesterday).toFixed(1)} кг</span>
              : '→ без изменений'}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
            value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
            placeholder="кг"
            step="0.1"
          />
          <button className="bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
            Сохранить
          </button>
        </div>
      </div>

      {/* Calories */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">🔥 Калории и БЖУ</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">Калории</div>
            <div className="text-lg font-bold text-orange-500">{caloriesTotal}</div>
            <div className="text-xs text-gray-400">из {profile.caloriesNorm} ккал</div>
            <ProgressBar value={caloriesTotal} max={profile.caloriesNorm} color="bg-orange-400" />
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">Белок</div>
            <div className="text-lg font-bold text-blue-500">{Math.round(proteinTotal)}г</div>
            <div className="text-xs text-gray-400">из {profile.proteinNorm}г</div>
            <ProgressBar value={proteinTotal} max={profile.proteinNorm} color="bg-blue-400" />
          </div>
        </div>
        <div className="space-y-1">
          {food.map(f => <FoodItem key={f.id} item={f} />)}
        </div>
        <button
          onClick={() => setShowAddFood(true)}
          className="w-full mt-2 border-2 border-dashed border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm text-gray-400 hover:border-purple-300 hover:text-purple-400 transition-colors"
        >
          <Plus size={16} /> Добавить приём пищи
        </button>
      </div>

      {/* Water */}
      <div className="bg-white px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-600">💧 Вода</h3>
          <span className="text-sm font-bold text-blue-500">{water}л / {profile.waterNorm}л</span>
        </div>
        <ProgressBar value={water} max={profile.waterNorm} color="bg-blue-400" />
        <div className="flex gap-2 mt-3">
          {[0.2, 0.25, 0.3, 0.5].map(v => (
            <button
              key={v}
              onClick={() => setWater(w => Math.min(profile.waterNorm, +(w + v).toFixed(1)))}
              className="flex-1 bg-blue-50 text-blue-600 text-xs font-semibold py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
              +{v}л
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="другой объём (л)"
            value={waterInput}
            onChange={e => setWaterInput(e.target.value)}
            step="0.1"
          />
          <button onClick={addWater} className="bg-blue-500 text-white px-3 py-2 rounded-xl text-sm">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Food habits */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-1">🥗 Питание</h3>
        <div className="divide-y divide-gray-50">
          {foodHabits.map(h => <HabitRow key={h.id} habit={h} onToggle={toggleHabit} />)}
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white px-4 py-4 mb-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-600">🏃 Активность</h3>
          <span className="text-xs text-gray-400">9 240 шагов сегодня</span>
        </div>
        <div className="divide-y divide-gray-50">
          {activityHabits.map(h => <HabitRow key={h.id} habit={h} onToggle={toggleHabit} />)}
        </div>
      </div>

      {/* Sleep */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-1">😴 Сон</h3>
        <div className="divide-y divide-gray-50">
          {sleepHabits.map(h => <HabitRow key={h.id} habit={h} onToggle={toggleHabit} />)}
        </div>
      </div>

      {/* Bad habits */}
      <div className="bg-red-50 px-4 py-4 mb-2 border-l-4 border-red-300">
        <h3 className="text-sm font-semibold text-red-600 mb-1">⚠️ Отметь если было</h3>
        <div className="divide-y divide-red-100">
          {badHabits.map(h => <HabitRow key={h.id} habit={h} onToggle={toggleBad} />)}
        </div>
      </div>

      {/* Close day */}
      <div className="px-4">
        <button
          onClick={() => setDayClosed(true)}
          className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
            dayClosed
              ? 'bg-green-100 text-green-600'
              : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-200'
          }`}
        >
          {dayClosed ? '✅ День закрыт!' : '✅ Закрыть день'}
        </button>
        {dayClosed && (
          <div className="mt-3 bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{eff}%</div>
            <div className="text-sm text-gray-500 mt-1">эффективность дня</div>
            <div className="text-xs text-gray-400 mt-2">Завтра сможешь лучше 💪</div>
          </div>
        )}
      </div>
    </div>
  );
}
