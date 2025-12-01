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
    pricePerHour: { type: Number, required: true },
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

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
