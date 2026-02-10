
import { Schema, model, models, Types } from "mongoose";

const CreditSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
    points: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Credit = models.Credit || model("Credit", CreditSchema);
