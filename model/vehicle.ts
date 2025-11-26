import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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
    office: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      required: true,
    },
    properties: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    serviceHistory: {
      tire: { type: Date, default: Date.now },
      oil: { type: Date, default: Date.now },
      battery: { type: Date, default: Date.now },
      air: { type: Date, default: Date.now },
      service: { type: Date, default: Date.now },
    },
    needsService: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle ||
  mongoose.model("Vehicle", vehicleSchema);
