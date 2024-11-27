import type { Variables } from '@/types';
import { Hono } from 'hono';
import { RefreshRoute } from './refresh';
import { SignInRoute } from './signin';
import { SignUpRoute } from './signup';

export const AuthRoutes = new Hono<{ Variables: Variables }>();

AuthRoutes.route('/', RefreshRoute);
AuthRoutes.route('/', SignInRoute);
AuthRoutes.route('/', SignUpRoute);
