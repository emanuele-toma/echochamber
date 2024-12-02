import { CONFIG } from '@/config';
import { Chamber, Post } from '@/models';
import type { Variables } from '@/types';
import { S3 } from '@/utils';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import sharp from 'sharp';
import { z } from 'zod';

export const PostRoutes = new Hono<{ Variables: Variables }>();

PostRoutes.post(
  '/chambers/:chamber/posts',
  zValidator(
    'json',
    z.object({
      title: z.string().min(1).max(64),
      content: z.string().min(1).max(65536),
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
    const { chamber: chamberName } = c.req.valid('param');
    const { userId } = c.get('user');

    const chamber = await Chamber.findOne({
      name: { $regex: new RegExp(`^${chamberName}$`, 'i') },
    });

    if (!chamber) {
      return c.json({ error: 'Chamber not found' }, 404);
    }

    const post = await Post.create({
      title,
      content,
      chamber: chamber._id,
      user: userId,
    });

    return c.json({ message: 'Post created', post: post.clean() });
  },
);

const allowedMediaTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

PostRoutes.post(
  '/chambers/:chamber/posts/media',
  zValidator(
    'form',
    z.object({
      title: z.string().min(1).max(64),
      content: z
        .instanceof(File)
        .and(
          z.custom(
            (file: File) =>
              allowedMediaTypes.includes(file.type) &&
              file.size < 20 * 1024 * 1024,
          ),
        ),
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
    const { title, content } = c.req.valid('form');
    const { chamber: chamberName } = c.req.valid('param');
    const { userId } = c.get('user');

    const chamber = await Chamber.findOne({
      name: { $regex: new RegExp(`^${chamberName}$`, 'i') },
    });

    if (!chamber) {
      return c.json({ error: 'Chamber not found' }, 404);
    }

    const post = await Post.create({
      title,
      media: true,
      chamber: chamber._id,
      user: userId,
    });

    const webp = await sharp(await content.arrayBuffer(), {
      animated: content.type === 'image/webp' || content.type === 'image/gif',
    })
      .webp()
      .toBuffer();

    const s3 = new S3();
    const command = new PutObjectCommand({
      Bucket: CONFIG.S3_BUCKET,
      Key: `chambers/${chamberName}/posts/${post._id}.webp`,
      Body: webp,
    });

    await s3.send(command);

    return c.json({ message: 'Post created', post: post.clean() });
  },
);

PostRoutes.get(
  '/chambers/:chamber/posts',
  zValidator(
    'param',
    z.object({
      chamber: z
        .string()
        .regex(/^[a-zA-Z]+$/)
        .max(32),
    }),
  ),
  zValidator(
    'query',
    z.object({
      sort: z.enum(['asc', 'desc']).default('desc'),
      sortBy: z.enum(['createdAt', 'votes']).default('createdAt'),
      limit: z.coerce.number().int().min(1).max(100).default(10),
      skip: z.coerce.number().int().min(0).default(0),
    }),
  ),
  async c => {
    const { chamber: chamberName } = c.req.valid('param');
    const { sort, sortBy, limit, skip } = c.req.valid('query');

    const chamber = await Chamber.findOne({
      name: { $regex: new RegExp(`^${chamberName}$`, 'i') },
    });

    if (!chamber) {
      return c.json({ error: 'Chamber not found' }, 404);
    }

    const posts = await Post.aggregate([
      { $match: { chamber: chamber._id } },
      {
        $addFields: {
          votes: { $subtract: ['$upvotes', '$downvotes'] },
        },
      },
      { $sort: { [sortBy]: sort === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    posts.forEach(post => delete post.__v);

    return c.json(posts);
  },
);

PostRoutes.get(
  '/chambers/:chamber/posts/:postId',
  zValidator(
    'param',
    z.object({
      chamber: z
        .string()
        .regex(/^[a-zA-Z]+$/)
        .max(32),
      postId: z.string(),
    }),
  ),
  async c => {
    const { chamber, postId } = c.req.valid('param');

    const post = await Post.findOne({ _id: postId, chamber: chamber });
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    return c.json(post.clean());
  },
);
