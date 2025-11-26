import mongoose from "mongoose";

const addOnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    pricingType: { type: String, enum: ["flat", "tiered"], required: true },
    flatPrice: {
      type: Number,
      min: 0,
      required: function (this: { pricingType: string }): boolean {
        return this.pricingType === "flat";
      },
    },
    tiers: [
      {
        minDays: { type: Number, required: true, min: 1 },
        maxDays: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

// Optional: Add a unique index on name to prevent duplicates

export default mongoose.models.AddOn || mongoose.model("AddOn", addOnSchema);
