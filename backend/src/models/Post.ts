import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  media?: boolean;
  chamber: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  upvotes: number;
  downvotes: number;
}

const postSchema = new Schema<IPost>({
  _id: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: Boolean, default: false },
  chamber: { type: Schema.Types.ObjectId, ref: 'Chamber', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

export const Post = mongoose.model<IPost>('Post', postSchema);
