const tg = window.Telegram?.WebApp;

export function isTelegram() {
  return !!tg?.initData;
}

export function getTelegramUser() {
  return tg?.initDataUnsafe?.user ?? null;
}

export function getTelegramTheme() {
  return tg?.colorScheme ?? 'light';
}

export function expandApp() {
  tg?.expand();
}

export function closeApp() {
  tg?.close();
}

export function haptic(type = 'light') {
  tg?.HapticFeedback?.impactOccurred(type);
}

// Вызвать при старте
export function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#ffffff');
  tg.setBackgroundColor('#f0f0f0');
}
