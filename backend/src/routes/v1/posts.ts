import { Post } from '@/models';
import type { Variables } from '@/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

export const PostRoutes = new Hono<{ Variables: Variables }>();

// Create a post
PostRoutes.post(
  '/chamber/:chamber/posts',
  zValidator(
    'json',
    z.object({
      title: z.string().min(1).max(64),
      content: z.string().min(1).max(1024),
    }),
  ),
  zValidator(
    'param',
    z.object({
      chamber: z
        .string()
        .regex(/^[a-zA-Z]+$/)
        .max(32),
    }),
  ),
  async c => {
    const { title, content } = c.req.valid('json');
    const { chamber } = c.req.valid('param');
    const { userId } = c.get('user');

    // Create a post with mongoose
    Post.create({
      title,
      content,
      chamber: chamber,
      user: userId,
    });

    return c.json({ message: 'Post created' });
  },
);
