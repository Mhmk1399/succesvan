import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: "",
    },
    textColor: {
      type: String,
      default: "#ffffff",
    },
    backgroundColor: {
      type: String,
      default: "#fe9a00",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);
