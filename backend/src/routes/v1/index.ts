import type { Variables } from '@/types';
import { Hono } from 'hono';
import { ChamberRoutes } from './chambers';
import { PostRoutes } from './posts';
import { CommentRoutes } from './comments';

export const V1Routes = new Hono<{ Variables: Variables }>();

V1Routes.route('/', ChamberRoutes);
V1Routes.route('/', PostRoutes);
V1Routes.route('/', CommentRoutes);
