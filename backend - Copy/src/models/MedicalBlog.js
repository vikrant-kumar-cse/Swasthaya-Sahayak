import mongoose from "mongoose";

const medicalBlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    mainCategory: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      default: "",
      trim: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MedicalBlog", medicalBlogSchema);
