import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

/**
 * Encrypt sensitive data like API keys
 */
export const encrypt = (text) => {
  if (!text) return null;

  const iv = crypto.randomBytes(IV_LENGTH);
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
};

/**
 * Decrypt encrypted data
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) return null;

  try {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = textParts.join(':');
    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Hash sensitive data (one-way)
 */
export const hash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

/**
 * Generate random string
 */
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};
