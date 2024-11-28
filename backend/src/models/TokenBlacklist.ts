import { Document, model, Schema, Types } from 'mongoose';

export interface IBlacklist extends Document {
  token: string;
  expiresAt: Date;
}

const BlacklistSchema = new Schema<IBlacklist>({
  _id: {
    type: Types.ObjectId,
    auto: true,
  },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }, // Matches the token's expiration
});

export const Blacklist = model('Blacklist', BlacklistSchema);
