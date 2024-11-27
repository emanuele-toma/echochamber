import { CONFIG } from '@/config';
import type { JwtPayload } from '@/types';
import jwt from 'jsonwebtoken';
import type mongoose from 'mongoose';

export const generateTokens = (
  userId: mongoose.Types.ObjectId,
  sessionId: mongoose.Types.ObjectId,
) => {
  const accessToken = jwt.sign({ userId }, CONFIG.ACCESS_TOKEN_SECRET, {
    expiresIn: CONFIG.ACCESS_TOKEN_EXPIRATION,
  });

  const payload: JwtPayload = { userId, sessionId };

  const refreshToken = jwt.sign(payload, CONFIG.REFRESH_TOKEN_SECRET, {
    expiresIn: CONFIG.REFRESH_TOKEN_EXPIRATION,
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
};

export const getExpirationDate = (token: string) => {
  try {
    const payload = jwt.decode(token) as JwtPayload;
    return new Date(payload.exp! * 1000);
  } catch {
    return null;
  }
};
