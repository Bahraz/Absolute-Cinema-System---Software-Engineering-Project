import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
// import randomstring from 'randomstring';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  surname: string;
  email: string;
  password: string;

  created_at?: Date;
  updated_at?: Date;

  comparePassword(password: string): boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, trim: true, minlength: 3 },
    surname: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    // apiToken: { type: String }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Pre-save hook
UserSchema.pre<IUser>("save", async function (next) {
  //   if (this.isNew) this.apiToken = randomstring.generate(30);

  // Rzutowanie this.password na string, bo TS może traktować jako unknown
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

// Metoda porównania hasła
UserSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password as string);
};

export const User = mongoose.model<IUser>("User", UserSchema);
