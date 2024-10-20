import mongoose, { Document, Schema } from "mongoose";

export interface IUserRegistration extends Document {
  name: string;
  password: string;
  role: "admin" | "user"; // Enum for role
  phone?: number;
  emailId?: string;
  accessToken?: string;
  refreshToken?: string;
  otp?: string;
  userId: string;
  createdAt: Date; // Ensure createdAt is of type Date
  updatedAt: Date; // Ensure updatedAt is of type Date
}

const UserSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    emailId: {
      type: String,
      unique: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    otp: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const UserRegistration = mongoose.model<IUserRegistration>(
  "UserRegistration",
  UserSchema
);

export default UserRegistration;
