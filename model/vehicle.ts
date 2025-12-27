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
    available: { type: Boolean },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
    number: { type: String, required: true },

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
