import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    expert: { type: String },
    image: { type: String },
    video: { type: String },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Type", required: true },
    showPrice: { type: Number, required: true, min: 0 },
    properties: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    requiredLicense: { type: String, required: true },
    servicesPeriod: {
      tire: { type: Number, min: 1 },
      oil: { type: Number, min: 1 },
      battery: { type: Number,  min: 1 },
      air: { type: Number, min: 1 },
      service: { type: Number, min: 1 },
    },
    pricingTiers: [
      {
        minDays: { type: Number, required: true, min: 1 },
        maxDays: { type: Number, required: true },
        pricePerDay: { type: Number, required: true, min: 0 },
      },
    ],
    extrahoursRate: { type: Number, required: true, min: 0 },
    fuel: {
      type: String,
      enum: ["gas", "diesel", "electric", "hybrid"],
      required: true,
    },
    gear: {
      availableTypes: [{
        type: String,
        enum: ["automatic", "manual"],
        required: true,
      }],
      automaticExtraCost: { type: Number, min: 0, default: 0 },
    },
    seats: { type: Number, required: true },
    doors: { type: Number, required: true },
  },
  { timestamps: true }
);

// Delete cached model to ensure schema updates are applied
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export default mongoose.model("Category", categorySchema);
