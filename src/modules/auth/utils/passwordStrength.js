// Computes a simple strength label/score for a password field.
export const getPasswordStrength = (password) => {
  if (!password || password.length === 0) return { label: 'Empty', score: 0 };
  if (password.length < 6) return { label: 'Too Weak', score: 1 };
  if (password.length < 8) return { label: 'Fair', score: 2 };
  if (password.length < 10) return { label: 'Good', score: 3 };
  return { label: 'Strong', score: 4 };
};
