import type { Variables } from '@/types';
import { Hono } from 'hono';
import { ChamberRoutes } from './chambers';
import { PostRoutes } from './posts';

export const V1Routes = new Hono<{ Variables: Variables }>();

V1Routes.route('/', ChamberRoutes);
V1Routes.route('/', PostRoutes);
