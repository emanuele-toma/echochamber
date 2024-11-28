import { Document, model, Schema, Types } from 'mongoose';

export interface ISession extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
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
