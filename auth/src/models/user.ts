import mongoose from 'mongoose';
import crypto from 'crypto';
import { Password } from '../services/password';

interface UserAttrs {
  name: string;
  email: string;
  password: string;
  photo?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  active: boolean;
}

interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  photo?: string;
  passwordChangedAt?: number;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  active: boolean;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Number,
      default: null,
    },
    passwordResetToken: String,
    passwordResetExpires: Number,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.pre<UserDoc>('save', async function (done) {
  if (!this.isModified('password') || this.isNew) {
    return done();
  }

  this.passwordChangedAt = Date.now() - 1000;
  done();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
