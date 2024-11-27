import { CONFIG } from '@/config';
import { Blacklist, Session } from '@/models';
import type { Variables } from '@/types';
import { generateTokens, getExpirationDate, verifyToken } from '@/utils';
import type { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { v4 } from 'uuid';

export const AuthMiddleware = async (
  c: Context<{ Variables: Variables }>,
  next: () => Promise<void>,
) => {
  // Retrieve tokens from cookies
  const accessToken =
    getCookie(c, 'access_token') ||
    c.req.header('authorization')?.split('Bearer ')[1] ||
    c.req.header('x-access-token');
  const refreshToken =
    getCookie(c, 'refresh_token') || c.req.header('x-refresh-token');

  if (accessToken) {
    // Verify the access token
    const accessPayload = verifyToken(accessToken, CONFIG.ACCESS_TOKEN_SECRET);
    if (accessPayload) {
      const session = await Session.exists({
        _id: accessPayload.sessionId,
      });

      if (!session) {
        return c.json({ error: 'Session not found' }, 403);
      }

      c.set('user', { userId: accessPayload.userId });
      return await next();
    }
  }

  // If access token is invalid or expired, attempt to use the refresh token
  if (refreshToken) {
    const blacklisted = await Blacklist.exists({ token: refreshToken });
    if (blacklisted) {
      return c.json({ error: 'Invalid refresh token' }, 403);
    }

    const refreshPayload = verifyToken(
      refreshToken,
      CONFIG.REFRESH_TOKEN_SECRET,
    );
    if (!refreshPayload) {
      return c.json({ error: 'Invalid or expired refresh token' }, 401);
    }

    // Check if the session exists
    const session = await Session.exists({
      sessionId: refreshPayload.sessionId,
    });
    if (!session) {
      return c.json({ error: 'Session not found' }, 403);
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(refreshPayload.userId, refreshPayload.sessionId);

    // Blacklist the old refresh token
    await Blacklist.create({
      _id: v4(),
      token: refreshToken,
      expiresAt: getExpirationDate(refreshToken),
    });

    setCookie(c, 'access_token', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: CONFIG.ACCESS_TOKEN_EXPIRATION,
    });

    setCookie(c, 'refresh_token', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: CONFIG.REFRESH_TOKEN_EXPIRATION,
    });

    // Attach the new user context
    c.set('user', { userId: refreshPayload.userId });
    return await next();
  }

  // No valid access or refresh token; authentication required
  return c.json({ error: 'Authentication required' }, 401);
};
