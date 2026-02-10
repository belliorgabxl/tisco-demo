import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    passwordHash: { type: String, required: true },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: { type: String, required: true, trim: true, lowercase: true },

    dateOfBirth: { type: Date, required: true },

    nationality: { type: String, default: "" },
    religion: { type: String, default: "" },

    nationalId: { type: String, default: "" },
    passportNumber: { type: String, default: "" },

    consent: {
      accepted: { type: Boolean, required: true },
      acceptedAt: { type: Date, required: true },
      policyVersion: { type: String, default: "v1" },
    },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
