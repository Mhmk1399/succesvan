import mongoose from "mongoose";

const officeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    workingTime: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
          required: true,
        },
        isOpen: { type: Boolean, required: true, default: true },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
      },
    ],
    cars: [
      {
        car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
        inventory: { type: Number, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Office || mongoose.model("Office", officeSchema);
