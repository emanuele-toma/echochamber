import { User } from '@/models';
import type { Variables } from '@/types';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcrypt';
import { Hono } from 'hono';
import { z } from 'zod';

export const SignUpRoute = new Hono<{ Variables: Variables }>();

SignUpRoute.post(
  '/signup',
  zValidator(
    'json',
    z.object({
      username: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    }),
  ),
  async c => {
    const { username, email, password } = c.req.valid('json');

    const existingUser = await User.exists({ $or: [{ username }, { email }] });
    if (existingUser) return c.json({ error: 'User already exists' }, 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return c.json({ message: 'User created successfully' });
  },
);
