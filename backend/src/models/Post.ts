import { Document, Schema, Types, model } from 'mongoose';

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  media?: boolean;
  chamber: Types.ObjectId;
  user: Types.ObjectId;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  clean(): IPost;
}

const postSchema = new Schema<IPost>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: Boolean, default: false },
  chamber: { type: Schema.Types.ObjectId, ref: 'Chamber', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

postSchema.methods.clean = function () {
  return {
    _id: this._id,
    title: this.title,
    content: this.content,
    media: this.media,
    chamber: this.chamber,
    user: this.user,
    upvotes: this.upvotes,
    downvotes: this.downvotes,
    createdAt: this.createdAt,
  };
};

// When saving a post, we will also update the User's `posts` field.
postSchema.post('save', async function (this: IPost) {
  const User = model('User');
  await User.updateOne({ _id: this.user }, { $push: { posts: this._id } });
});

export const Post = model<IPost>('Post', postSchema);
