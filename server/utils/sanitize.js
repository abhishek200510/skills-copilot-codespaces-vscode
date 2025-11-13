/**
 * Sanitize user input to prevent NoSQL injection
 * Removes MongoDB operators from input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  const sanitized = Array.isArray(input) ? [] : {};

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      // Remove keys starting with $ (MongoDB operators)
      if (key.startsWith('$')) {
        continue;
      }
      
      // Recursively sanitize nested objects
      if (typeof input[key] === 'object' && input[key] !== null) {
        sanitized[key] = sanitizeInput(input[key]);
      } else {
        sanitized[key] = input[key];
      }
    }
  }

  return sanitized;
};

/**
 * Escape regex special characters to prevent regex injection
 */
export const escapeRegex = (string) => {
  if (typeof string !== 'string') {
    return string;
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
