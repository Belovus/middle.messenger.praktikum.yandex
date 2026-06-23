const RULES: Record<string, (value: string) => string | null> = {
  first_name: (value) => {
    if (!value) return 'Поле не может быть пустым';
    if (!/^[A-ZА-Я][a-zа-я-]*$/.test(value)) return 'Первая буква заглавная, без пробелов и цифр';
    return null;
  },
  second_name: (value) => {
    if (!value) return 'Поле не может быть пустым';
    if (!/^[A-ZА-Я][a-zа-я-]*$/.test(value)) return 'Первая буква заглавная, без пробелов и цифр';
    return null;
  },
  login: (value) => {
    if (!value) return 'Поле не может быть пустым';
    if (value.length < 3 || value.length > 20) return 'От 3 до 20 символов';
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value)) return 'Может содержать цифры, дефис и подчёркивание';
    if (/^\d+$/.test(value)) return 'Не может состоять только из цифр';
    return null;
  },
  email: (value) => {
    if (!value) return 'Поле не может быть пустым';
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(value)) return 'Некорректный email';
    return null;
  },
  password: (value) => {
    if (!value) return 'Поле не может быть пустым';
    if (value.length < 8 || value.length > 40) return 'От 8 до 40 символов';
    if (!/[A-Z]/.test(value)) return 'Минимум одна заглавная буква';
    if (!/\d/.test(value)) return 'Минимум одна цифра';
    return null;
  },
  phone: (value) => {
    if (!value) return 'Поле не может быть пустым';
    if (!/^\+?\d{10,15}$/.test(value)) return 'От 10 до 15 цифр, может начинаться с +';
    return null;
  },
  message: (value) => {
    if (!value.trim()) return 'Сообщение не может быть пустым';
    return null;
  },
  confirm_password: (value) => {
    if (!value) return 'Поле не может быть пустым';
    return null;
  }
};

export function validateField(name: string, value: string): string | null {
  const rule = RULES[name];
  if (!rule) return null;
  return rule(value);
}

export function validateForm(data: Record<string, string>): Record<string, string | null> {
  const errors: Record<string, string | null> = {};
  for (const [name, value] of Object.entries(data)) {
    errors[name] = validateField(name, value);
  }
  return errors;
}
