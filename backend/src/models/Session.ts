import mongoose, { Schema, model } from 'mongoose';

interface ISession {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  description?: string;
}

const SessionSchema = new Schema<ISession>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String }, // e.g., "Chrome on Windows"
});

export const Session = model('Session', SessionSchema);
