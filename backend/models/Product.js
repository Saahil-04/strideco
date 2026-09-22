import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["running", "lifestyle", "basketball", "training", "sandals"],
    },
    sizes: [{ type: Number }],
    colors: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    sold: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
