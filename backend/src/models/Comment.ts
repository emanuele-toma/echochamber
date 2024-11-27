import mongoose, { Document, Schema } from 'mongoose';

interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  votes: number;
}

const commentSchema = new Schema<IComment>({
  _id: { type: Schema.Types.ObjectId },
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 },
});

// When saving a comment, we will also update the User's `comments` field.
commentSchema.post('save', async function (this: IComment) {
  const User = mongoose.model('User');
  await User.updateOne({ _id: this.user }, { $push: { comments: this._id } });
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
