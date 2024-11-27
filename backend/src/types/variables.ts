import type mongoose from 'mongoose';

export type Variables = {
  user: {
    userId: mongoose.Types.ObjectId;
  };
};
