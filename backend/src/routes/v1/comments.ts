import { AuthMiddleware } from '@/middlewares';
import { Chamber, Comment, Post } from '@/models';
import type { Variables } from '@/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

export const CommentRoutes = new Hono<{ Variables: Variables }>();

// Create a comment under a post
CommentRoutes.post(
  '/chambers/:chamber/posts/:postId/comments',
  AuthMiddleware,
  zValidator(
    'json',
    z.object({
      content: z.string().min(1).max(65536),
    }),
  ),
  zValidator(
    'param',
    z.object({
      chamber: z.string(),
      postId: z.string(),
      replyTo: z.string().optional(),
    }),
  ),
  async c => {
    const { content } = c.req.valid('json');
    const { chamber: chamberName, postId, replyTo } = c.req.valid('param');
    const { userId } = c.get('user');

    const chamber = await Chamber.findOne({
      name: { $regex: new RegExp(`^${chamberName}$`, 'i') },
    });

    if (!chamber) {
      return c.json({ error: 'Chamber not found' }, 404);
    }

    const post = await Post.findById(postId);

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (replyTo) {
      const comment = await Comment.findById(replyTo);

      if (!comment) {
        return c.json({ error: 'Comment not found' }, 404);
      }
    }

    const comment = await Comment.create({
      content,
      post: post._id,
      user: userId,
      replyTo: replyTo,
    });

    return c.json({ message: 'Comment created', comment: comment.clean() });
  },
);

// Get all comments under a post, sortable by creation date or by votes
CommentRoutes.get(
  '/chambers/:chamber/posts/:postId/comments',
  zValidator(
    'param',
    z.object({
      chamber: z.string(),
      postId: z.string(),
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
    const { chamber: chamberName, postId } = c.req.valid('param');
    const { sort, sortBy, limit, skip } = c.req.valid('query');

    const chamber = await Chamber.findOne({
      name: { $regex: new RegExp(`^${chamberName}$`, 'i') },
    });

    if (!chamber) {
      return c.json({ error: 'Chamber not found' }, 404);
    }

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
