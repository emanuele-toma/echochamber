import type mongoose from 'mongoose';

export interface JwtPayload {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  exp?: number;
}
