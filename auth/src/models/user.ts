import mongoose from 'mongoose';
import { Password } from '../utils/password';

interface UserAttrs {
  name: string;
  email: string;
  password: string;
  username: string;
  photo?: string;
  bio?: string;
  passwordChangedAt?: number;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  active: boolean;
}

interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  username: string;
  photo?: string;
  bio?: string;
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
    username: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Number,
      default: undefined,
    },
    passwordResetToken: {
      type: String,
      default: undefined,
    },
    passwordResetExpires: {
      type: Number,
      default: undefined,
    },
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
        delete ret.passwordChangedAt;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.active;
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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
