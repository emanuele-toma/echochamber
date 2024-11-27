import mongoose, { Document, Schema } from 'mongoose';

interface IChamber extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  posts: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
}

const chamberSchema = new Schema<IChamber>({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

export const Chamber = mongoose.model<IChamber>('Chamber', chamberSchema);
