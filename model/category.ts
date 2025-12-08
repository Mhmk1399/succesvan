import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Type", required: true },
    servicesPeriod: {
      tire: { type: Number, required: true, min: 1 },
      oil: { type: Number, required: true, min: 1 },
      battery: { type: Number, required: true, min: 1 },
      air: { type: Number, required: true, min: 1 },
      service: { type: Number, required: true, min: 1 },
    },
    pricingTiers: [
      {
        minHours: { type: Number, required: true, min: 0 },
        maxHours: { type: Number, required: true },
        pricePerHour: { type: Number, required: true, min: 0 },
      },
    ],
    fuel: {
      type: String,
      enum: ["gas", "diesel", "electric", "hybrid"],
      required: true,
    },
    gear: {
      type: String,
      enum: ["automatic", "manual", "manual,automatic"],
      required: true,
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
