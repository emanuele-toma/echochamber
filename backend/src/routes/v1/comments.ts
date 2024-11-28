import { Comment, Post } from '@/models';
import type { Variables } from '@/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

export const CommentRoutes = new Hono<{ Variables: Variables }>();

// Create a comment under a post
CommentRoutes.post(
  '/posts/:postId/comments',
  zValidator(
    'json',
    z.object({
      content: z.string().min(1).max(65536),
    }),
  ),
  zValidator(
    'param',
    z.object({
      postId: z.string(),
    }),
  ),
  async c => {
    const { content } = c.req.valid('json');
    const { postId } = c.req.valid('param');
    const { userId } = c.get('user');

    const post = await Post.findById(postId);

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const comment = await Comment.create({
      content,
      post: post._id,
      user: userId,
    });

    return c.json({ message: 'Comment created', comment: comment.clean() });
  },
);

// Get all comments under a post, sortable by creation date or by votes
CommentRoutes.get(
  '/posts/:postId/comments',
  zValidator(
    'param',
    z.object({
      postId: z.string(),
    }),
  ),
  zValidator(
    'query',
    z.object({
      sort: z.enum(['asc', 'desc']).default('desc'),
      sortBy: z.enum(['createdAt', 'votes']).default('createdAt'),
      limit: z.number().int().min(1).max(100).default(10),
      skip: z.number().int().min(0).default(0),
    }),
  ),
  async c => {
    const { postId } = c.req.valid('param');
    const { sort, sortBy, limit, skip } = c.req.valid('query');

    const post = await Post.findById(postId);

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const comments = await Comment.aggregate([
      { $match: { post: post._id } },
      {
        $addFields: {
          votes: { $subtract: ['$upvotes', '$downvotes'] },
        },
      },
      { $sort: { [sortBy]: sort === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    comments.forEach(comment => delete comment.__v);

    return c.json(comments);
  },
);
