import { AuthMiddleware } from '@/middlewares';
import { Chamber } from '@/models';
import type { Variables } from '@/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

export const ChamberRoutes = new Hono<{ Variables: Variables }>();

// Create a chamber
ChamberRoutes.post(
  '/chambers',
  AuthMiddleware,
  zValidator(
    'json',
    z.object({
      name: z
        .string()
        .regex(/^[a-zA-Z]+$/)
        .max(32),
      description: z.string().min(1).max(256),
    }),
  ),
  async c => {
    const { name, description } = c.req.valid('json');

    const chamber = await Chamber.exists({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (chamber) {
      return c.json({ error: 'Chamber already exists' }, 400);
    }

    const { userId } = c.get('user');

    const newChamber = await Chamber.create({
      name,
      description,
      owner: userId,
    });

    return c.json({
      message: 'Chamber created',
      chamber: newChamber.clean(),
    });
  },
);

// Get chamber by name
ChamberRoutes.get(
  '/chambers/:name',
  zValidator(
    'param',
    z.object({
      name: z
        .string()
        .regex(/^[a-zA-Z]+$/)
        .max(32),
    }),
  ),
  async c => {
    const { name } = c.req.valid('param');

    const chamber = await Chamber.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    }).select('-posts');

    if (!chamber) {
      return c.json({ error: 'Chamber not found' }, 404);
    }

    return c.json(chamber.clean());
  },
);
