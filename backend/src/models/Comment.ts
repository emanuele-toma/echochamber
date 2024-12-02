import { Document, Schema, Types, model } from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  content: string;
  post: Types.ObjectId;
  user: Types.ObjectId;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  replyTo: Types.ObjectId;
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
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  replyTo: { type: Schema.Types.ObjectId, ref: 'Comment' },
});

commentSchema.methods.clean = function () {
  return {
    _id: this._id,
    content: this.content,
    post: this.post,
    user: this.user,
    upvotes: this.upvotes,
    downvotes: this.downvotes,
    createdAt: this.createdAt,
    replyTo: this.replyTo,
  };
};

export const Comment = model<IComment>('Comment', commentSchema);
