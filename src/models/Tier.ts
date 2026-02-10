
import { Schema, model, models } from "mongoose";

const TierSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. BASIC, SUPREME
    name: { type: String, required: true },              // e.g. Supreme
    minPoints: { type: Number, required: true },         // threshold
  },
  { timestamps: true }
);

export const Tier = models.Tier || model("Tier", TierSchema);
