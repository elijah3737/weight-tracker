export const profile = {
  name: 'Аня',
  weightStart: 68.0,
  weightGoal: 62.0,
  weightCurrent: 66.4,
  caloriesNorm: 1500,
  proteinNorm: 120,
  waterNorm: 2.2,
  stepsNorm: 7000,
  daysSinceStart: 12,
  forecastDate: '15 августа',
};

export const todayData = {
  weight: 66.4,
  weightYesterday: 66.6,
  calories: 820,
  protein: 68,
  fat: 32,
  carbs: 95,
  water: 1.2,
  steps: 9240,
  score: 48,
  scoreMax: 75,
};

export const habits = [
  { id: 1, name: '2 литра воды', icon: '💧', cat: 'food', points: 7, done: false, isWater: true },
  { id: 2, name: '1 свежий овощ', icon: '🥗', cat: 'food', points: 6, done: false },
  { id: 3, name: '1 фрукт / ягоды', icon: '🍓', cat: 'food', points: 5, done: false },
  { id: 4, name: 'Кофе до 16:00', icon: '☕', cat: 'food', points: 4, done: true },
  { id: 5, name: '3 полноценных приёма пищи', icon: '🍽', cat: 'food', points: 8, done: false },
  { id: 6, name: '110–120г белка', icon: '🥩', cat: 'food', points: 8, done: false, isProtein: true },
  { id: 7, name: 'Тренировка', icon: '🏋️', cat: 'activity', points: 10, done: false },
  { id: 8, name: 'Шаги > 7 000', icon: '🚶', cat: 'activity', points: 7, done: true },
  { id: 9, name: 'Сон ≥ 7 часов', icon: '😴', cat: 'sleep', points: 9, done: true },
  { id: 10, name: 'Лечь до 22:30', icon: '🛏', cat: 'sleep', points: 6, done: false },
];

export const badHabits = [
  { id: 11, name: 'Кофе после 16:00', icon: '☕', points: -7, done: false },
  { id: 12, name: 'Калорий меньше 1300', icon: '📉', points: -8, done: false },
  { id: 13, name: 'Еда без подсчётов', icon: '🍕', points: -9, done: false },
  { id: 14, name: 'Солёное после 18:00', icon: '🧂', points: -5, done: false },
  { id: 15, name: 'Лёг(ла) после 23:00', icon: '🌙', points: -9, done: false },
];

export const foodLogs = [
  { id: 1, time: '08:30', name: 'Овсянка с бананом', kcal: 320, protein: 9, fat: 6, carbs: 58, source: 'photo' },
  { id: 2, time: '13:15', name: 'Гречка с курицей', kcal: 420, protein: 48, fat: 6, carbs: 38, source: 'photo' },
  { id: 3, time: '16:00', name: 'Яблоко', kcal: 80, protein: 0.5, fat: 0.3, carbs: 21, source: 'text' },
];

export const monthData = (() => {
  const data = [];
  for (let d = 1; d <= 31; d++) {
    if (d > 12) { data.push({ day: d, eff: null }); continue; }
    const scores = [82, 55, 38, 77, 74, 62, 45, 88, 71, 39, 83, 64];
    data.push({ day: d, eff: scores[d - 1] });
  }
  return data;
})();

export const weightHistory = [
  { date: '1 мая', weight: 68.0 },
  { date: '3 мая', weight: 67.8 },
  { date: '5 мая', weight: 67.5 },
  { date: '7 мая', weight: 67.3 },
  { date: '9 мая', weight: 67.0 },
  { date: '11 мая', weight: 66.7 },
  { date: '12 мая', weight: 66.4 },
  { date: '20 мая', weight: null, forecast: 65.8 },
  { date: '1 июн', weight: null, forecast: 65.0 },
  { date: '1 июл', weight: null, forecast: 63.5 },
  { date: '15 авг', weight: null, forecast: 62.0 },
];
