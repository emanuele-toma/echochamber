import mongoose, { Document, Schema } from 'mongoose';

interface IVote extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId | null;
  comment: mongoose.Types.ObjectId | null;
  value: number; // 1 for upvote, -1 for downvote
}

const voteSchema = new Schema<IVote>({
  _id: { type: Schema.Types.ObjectId },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: false },
  comment: { type: Schema.Types.ObjectId, ref: 'Comment', required: false },
  value: { type: Number, required: true, enum: [-1, 1] },
});

export const Vote = mongoose.model<IVote>('Vote', voteSchema);
