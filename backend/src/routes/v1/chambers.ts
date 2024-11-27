import { Chamber } from '@/models';
import type { Variables } from '@/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Types } from 'mongoose';
import { z } from 'zod';

export const ChamberRoutes = new Hono<{ Variables: Variables }>();

// Create a chamber
ChamberRoutes.post(
  '/chambers',
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

    const chamber = await Chamber.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (chamber) {
      return c.json({ error: 'Chamber already exists' }, 400);
    }

    const { userId } = c.get('user');

    const newChamber = await Chamber.create({
      _id: new Types.ObjectId(),
      name,
      description,
      owner: userId,
    });

    return c.json(newChamber);
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

    return c.json(chamber);
  },
);
