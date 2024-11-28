import { Document, Schema, Types, model } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  chambers: Types.ObjectId[];
  clean(): Omit<IUser, 'password'>;
}

const userSchema = new Schema<IUser>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  chambers: [{ type: Schema.Types.ObjectId, ref: 'Chamber' }],
});

userSchema.methods.clean = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    chambers: this.chambers,
  };
};

export const User = model<IUser>('User', userSchema);
