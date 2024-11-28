import { Document, Schema, Types, model } from 'mongoose';

export interface IChamber extends Document {
  name: string;
  description: string;
  owner: Types.ObjectId;
  clean(): IChamber;
}

const chamberSchema = new Schema<IChamber>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
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

export const Chamber = model<IChamber>('Chamber', chamberSchema);
