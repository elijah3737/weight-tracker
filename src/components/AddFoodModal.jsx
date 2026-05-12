import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';

const QUICK_FOODS = [
  { name: 'Овсянка на молоке (200г)', kcal: 180, protein: 7, fat: 5, carbs: 28 },
  { name: 'Куриная грудка (150г)', kcal: 165, protein: 31, fat: 3, carbs: 0 },
  { name: 'Гречка отварная (200г)', kcal: 212, protein: 8, fat: 2, carbs: 42 },
  { name: 'Яйцо варёное (1 шт)', kcal: 78, protein: 6, fat: 5, carbs: 0.5 },
  { name: 'Творог 5% (150г)', kcal: 127, protein: 17, fat: 6, carbs: 3 },
  { name: 'Банан (1 шт)', kcal: 89, protein: 1, fat: 0.3, carbs: 23 },
  { name: 'Яблоко (1 шт)', kcal: 52, protein: 0.3, fat: 0.2, carbs: 14 },
  { name: 'Рис отварной (150г)', kcal: 173, protein: 3, fat: 0.3, carbs: 38 },
  { name: 'Лосось запечённый (150г)', kcal: 279, protein: 30, fat: 18, carbs: 0 },
  { name: 'Огурец (100г)', kcal: 15, protein: 0.7, fat: 0.1, carbs: 3 },
];

const EMPTY = { name: '', kcal: '', protein: '', fat: '', carbs: '' };

export default function AddFoodModal({ onClose, onAdd }) {
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tab, setTab] = useState('quick'); // 'quick' | 'manual'
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query.length > 1
    ? QUICK_FOODS.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : QUICK_FOODS;

  const selectQuick = (food) => {
    setForm({ name: food.name, kcal: food.kcal, protein: food.protein, fat: food.fat, carbs: food.carbs });
    setTab('manual');
    setShowAdvanced(true);
  };

  const isValid = form.name.trim() && Number(form.kcal) > 0;

  const handleAdd = () => {
    if (!isValid) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    onAdd({
      id: Date.now(),
      time,
      name: form.name.trim(),
      kcal: Number(form.kcal) || 0,
      protein: Number(form.protein) || 0,
      fat: Number(form.fat) || 0,
      carbs: Number(form.carbs) || 0,
      source: 'text',
    });
    onClose();
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const adjust = (field, delta) => {
    setForm(f => ({ ...f, [field]: Math.max(0, +(Number(f[field] || 0) + delta).toFixed(1)) }));
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-20" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white rounded-t-2xl z-30 shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">Добавить приём пищи</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-4 mt-3 mb-3 bg-gray-100 rounded-xl p-1">
          {[['quick', '🔍 Быстрый выбор'], ['manual', '✏️ Вручную']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === id ? 'bg-white shadow text-purple-600' : 'text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-6 max-h-[70vh] overflow-y-auto">
          {tab === 'quick' && (
            <>
              <input
                ref={inputRef}
                type="text"
                placeholder="Поиск продукта..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 mb-3"
              />
              <div className="space-y-2">
                {filtered.map(f => (
                  <button
                    key={f.name}
                    onClick={() => selectQuick(f)}
                    className="w-full flex items-center justify-between bg-gray-50 hover:bg-purple-50 rounded-xl px-3 py-3 transition-colors text-left"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800">{f.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Б {f.protein}г · Ж {f.fat}г · У {f.carbs}г
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-orange-500">{f.kcal} ккал</span>
                      <Plus size={16} className="text-purple-400 flex-shrink-0" />
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    Не нашли? <button onClick={() => setTab('manual')} className="text-purple-500 font-medium">Введите вручную</button>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'manual' && (
            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Название блюда *</label>
                <input
                  ref={tab === 'manual' ? inputRef : null}
                  type="text"
                  placeholder="Например: Борщ со сметаной"
                  value={form.name}
                  onChange={set('name')}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Kcal — main field */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Калории *</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => adjust('kcal', -10)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Minus size={16} className="text-gray-500" />
                  </button>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.kcal}
                    onChange={set('kcal')}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center font-bold focus:outline-none focus:border-purple-400"
                  />
                  <span className="text-sm text-gray-400 flex-shrink-0">ккал</span>
                  <button onClick={() => adjust('kcal', 10)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Plus size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* BJU toggle */}
              <button
                onClick={() => setShowAdvanced(v => !v)}
                className="flex items-center gap-1.5 text-sm text-purple-500 font-medium"
              >
                {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                {showAdvanced ? 'Скрыть БЖУ' : 'Добавить БЖУ (необязательно)'}
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-3 gap-2">
                  {[['protein', '🥩 Белок'], ['fat', '🧈 Жиры'], ['carbs', '🌾 Углеводы']].map(([field, label]) => (
                    <div key={field}>
                      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={() => adjust(field, 1)} className="w-full h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Plus size={12} className="text-gray-500" />
                        </button>
                        <input
                          type="number"
                          placeholder="0"
                          value={form[field]}
                          onChange={set(field)}
                          className="w-full border border-gray-200 rounded-xl px-2 py-2 text-sm text-center focus:outline-none focus:border-purple-400"
                        />
                        <button onClick={() => adjust(field, -1)} className="w-full h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Minus size={12} className="text-gray-500" />
                        </button>
                        <span className="text-xs text-gray-400">г</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview */}
              {form.name && Number(form.kcal) > 0 && (
                <div className="bg-orange-50 rounded-xl p-3 text-sm">
                  <div className="font-medium text-gray-800 mb-1">{form.name}</div>
                  <div className="flex gap-3 text-gray-500 text-xs">
                    <span className="font-bold text-orange-500">{form.kcal} ккал</span>
                    {form.protein > 0 && <span>Б: {form.protein}г</span>}
                    {form.fat > 0 && <span>Ж: {form.fat}г</span>}
                    {form.carbs > 0 && <span>У: {form.carbs}г</span>}
                  </div>
                </div>
              )}

              <button
                onClick={handleAdd}
                disabled={!isValid}
                className={`w-full py-3.5 rounded-2xl text-base font-bold mt-1 transition-all ${
                  isValid
                    ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-200'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                Добавить
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
