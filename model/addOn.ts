import mongoose from "mongoose";

const addOnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  pricingType: { type: String, enum: ["flat", "tiered"], required: true },
  flatPrice: {
    type: Number,
    min: 0,
    required: function () {
      return this.pricingType === "flat";
    },
  },
  tiers: {
    type: [
      {
        minDays: { type: Number, required: true, min: 1 },
        maxDays: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    required: function () {
      return this.pricingType === "tiered";
    },
    validate: {
      validator: function (tiers) {
        if (this.pricingType !== "tiered") return true;
        return tiers.length > 0; // Ensure at least one tier if tiered
      },
      message: "At least one tier is required for tiered pricing.",
    },
  },
}, { timestamps: true });

// Optional: Add a unique index on name to prevent duplicates
addOnSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.AddOn || mongoose.model("AddOn", addOnSchema);