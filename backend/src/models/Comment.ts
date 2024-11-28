import { Document, Schema, Types, model } from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  content: string;
  post: Types.ObjectId;
  user: Types.ObjectId;
  votes: number;
  createdAt: Date;
  clean(): IComment;
}

const commentSchema = new Schema<IComment>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

commentSchema.methods.clean = function () {
  return {
    _id: this._id,
    content: this.content,
    post: this.post,
    user: this.user,
    votes: this.votes,
    createdAt: this.createdAt,
  };
};

// When saving a comment, we will also update the User's `comments` field.
commentSchema.post('save', async function (this: IComment) {
  const User = model('User');
  await User.updateOne({ _id: this.user }, { $push: { comments: this._id } });
});

export const Comment = model<IComment>('Comment', commentSchema);
