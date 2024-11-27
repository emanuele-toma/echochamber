import mongoose, { model, Schema } from 'mongoose';

interface IBlacklist {
  _id: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const BlacklistSchema = new Schema<IBlacklist>({
  _id: { type: Schema.Types.ObjectId },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }, // Matches the token's expiration
});

export const Blacklist = model('Blacklist', BlacklistSchema);
