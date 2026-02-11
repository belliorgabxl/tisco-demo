import { Schema, model, models, Types } from "mongoose";

const CreditSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    tiscoPoint: { type: Number, required: true, default: 0 },
    twealthPoint: { type: Number, required: true, default: 0 },
    tinsurePoint: { type: Number, required: true, default: 0 },
    totalPoints: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

CreditSchema.virtual("calculatedTotal").get(function () {
  return this.tiscoPoint + this.twealthPoint + this.tinsurePoint;
});

export const Credit = models.Credit || model("Credit", CreditSchema);
