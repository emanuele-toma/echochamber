import mongoose, { Document, Schema } from 'mongoose';

interface IChamber extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  posts: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
  clean(): IChamber;
}

const chamberSchema = new Schema<IChamber>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

chamberSchema.methods.clean = function () {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    owner: this.owner,
  };
};

export const Chamber = mongoose.model<IChamber>('Chamber', chamberSchema);
