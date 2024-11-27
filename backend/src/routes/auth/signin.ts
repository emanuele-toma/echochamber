import { CONFIG } from '@/config';
import { Session, User } from '@/models';
import type { Variables } from '@/types';
import { generateTokens } from '@/utils';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcrypt';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';

export const SignInRoute = new Hono<{ Variables: Variables }>();

SignInRoute.post(
  '/signin',
  zValidator(
    'json',
    z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
      })
      .or(
        z.object({
          username: z.string().min(3),
          password: z.string().min(6),
        }),
      ),
  ),
  async c => {
    const validated = c.req.valid('json');
    const { password } = validated;
    const email = 'email' in validated ? validated.email : null;
    const username = 'username' in validated ? validated.username : null;

    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return c.json({ error: 'Invalid credentials' }, 400);
    }

    const userAgent = c.req.header('user-agent');
    const { browser, os } = UAParser(userAgent);

    const description = `${browser.name} ${browser.version} on ${os.name} ${os.version}`;

    const session = await Session.create({
      user: user._id,
      description,
    });

    const { accessToken, refreshToken } = generateTokens(user._id, session._id);

    setCookie(c, 'access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: CONFIG.ACCESS_TOKEN_EXPIRATION / 1000,
    });

    setCookie(c, 'refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: CONFIG.REFRESH_TOKEN_EXPIRATION / 1000,
    });

    return c.json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
    });
  },
);
