// Простая проверка даты (ДД.ММ.ГГГГ)
export const isValidBirthDate = (date: string): boolean => {
  if (!date.trim()) return true;
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) return false;
  const [d, m, y] = date.split('.').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return (
    dateObj.getFullYear() === y &&
    dateObj.getMonth() === m - 1 &&
    dateObj.getDate() === d &&
    y >= 1900 &&
    y <= new Date().getFullYear()
  );
};

// Простая проверка для телефона
export const isValidPhone = (phone: string): boolean => {
  if (!phone.trim()) return true;
  return /^(\+7|8)\d{10}$/.test(phone.replace(/[\s\-()]/g, ''));
};

// проверка UserName
export const validateUsername = (username: string) =>
  !(username.length < 6 || username.length > 20 || username.includes(' '));