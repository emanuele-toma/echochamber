import { CONFIG } from '@/config';
import { Blacklist, Session } from '@/models';
import type { Variables } from '@/types';
import { generateTokens, getExpirationDate, verifyToken } from '@/utils';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';

export const RefreshRoute = new Hono<{ Variables: Variables }>();

RefreshRoute.post('/refresh', async c => {
  const refreshToken = getCookie(c, 'refresh_token');
  if (!refreshToken) return c.json({ error: 'No refresh token provided' }, 401);

  const blacklisted = await Blacklist.findOne({ token: refreshToken });
  if (blacklisted) return c.json({ error: 'Token is blacklisted' }, 403);

  const payload = verifyToken(refreshToken, CONFIG.REFRESH_TOKEN_SECRET);
  if (!payload) return c.json({ error: 'Invalid token' }, 401);

  const session = await Session.findOne({ _id: payload.sessionId });
  if (!session) return c.json({ error: 'Session not found' }, 403);

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    payload.userId,
    payload.sessionId,
  );

  await Blacklist.create({
    token: refreshToken,
    expiresAt: getExpirationDate(refreshToken),
  });

  // Set new tokens
  setCookie(c, 'access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: CONFIG.ACCESS_TOKEN_EXPIRATION / 1000,
  });

  setCookie(c, 'refresh_token', newRefreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: CONFIG.REFRESH_TOKEN_EXPIRATION / 1000,
  });

  return c.json({
    message: 'Tokens refreshed',
    accessToken,
    refreshToken: newRefreshToken,
  });
});
