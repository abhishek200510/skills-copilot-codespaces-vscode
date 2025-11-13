import jwt from 'jsonwebtoken';

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token, isRefreshToken = false) => {
  try {
    const secret = isRefreshToken ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
