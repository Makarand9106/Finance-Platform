import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture: string | null;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;

  omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);

  next();
});

userSchema.methods.omitPassword = function () {
  const userObject = this.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await compareValue(password, this.password);
};

const UserModel = mongoose.model<UserDocument>("User",userSchema);

export default UserModel;