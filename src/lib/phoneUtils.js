// Phone formatting and validation utilities for Uzbekistan (+998)

export const formatUzPhone = (value) => {
  if (!value) return '';

  // Extract all digits
  let digits = value.replace(/\D/g, '');

  // Remove leading 998 if present
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }

  // Maximum 9 national digits (e.g. 90 123 45 67)
  digits = digits.slice(0, 9);

  if (digits.length === 0) return '';

  let formatted = '+998';
  if (digits.length > 0) {
    formatted += ` (${digits.slice(0, Math.min(2, digits.length))}`;
  }
  if (digits.length >= 2) {
    formatted += `) ${digits.slice(2, Math.min(5, digits.length))}`;
  }
  if (digits.length >= 5) {
    formatted += `-${digits.slice(5, Math.min(7, digits.length))}`;
  }
  if (digits.length >= 7) {
    formatted += `-${digits.slice(7, 9)}`;
  }
  return formatted;
};

// Handle input change with backspace awareness and optional setter callback
export const handlePhoneInputChange = (e, prevOrSetter = '') => {
  let val = e.target.value;
  const prevValue = typeof prevOrSetter === 'string' ? prevOrSetter : '';

  // If user hit backspace on a formatting char like ')' or '-'
  if (prevValue && val.length < prevValue.length) {
    const prevDigits = prevValue.replace(/\D/g, '');
    const newDigits = val.replace(/\D/g, '');
    if (prevDigits.length === newDigits.length && newDigits.length > 0) {
      // Strip one more character so backspace removes the actual digit
      val = val.slice(0, -1);
    }
  }

  const formatted = formatUzPhone(val);

  // If a setter callback was passed (e.g. setCustomerPhone)
  if (typeof prevOrSetter === 'function') {
    prevOrSetter(formatted);
  }

  return formatted;
};

// Keydown blocker: strictly prevent letters and non-numeric keys
export const blockNonPhoneKeys = (e) => {
  // Allow navigation, control keys, and shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.key === 'Unidentified' ||
    e.key === 'Process' ||
    e.keyCode === 229 ||
    [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
      'Home',
      'End',
      'Enter',
      'Escape'
    ].includes(e.key)
  ) {
    return;
  }

  // Allow + only if at the start
  if (e.key === '+' && (e.target.selectionStart === 0 || !e.target.value)) {
    return;
  }

  // Allow digits 0-9 from both standard keys and numpad
  if (/^[0-9]$/.test(e.key) || /^Numpad[0-9]$/.test(e.code)) {
    return;
  }

  // Block letters and other special symbols
  e.preventDefault();
};

// Validate that the phone has complete Uzbekistan 9 digits (+998 XX XXX-XX-XX)
export const isValidUzPhone = (value) => {
  if (!value) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('998');
};
