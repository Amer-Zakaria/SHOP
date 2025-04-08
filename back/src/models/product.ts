import { Schema, model } from "mongoose";

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1000,
      unique: true,
      trim: true,
    },
    nameAr: {
      type: String,
      maxLength: 1000,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Categories",
      trim: true,
    },
    subcategory: {
      type: String,
      required: true,
      min: 1,
      trim: true,
    },
    subcategoryAr: {
      type: String,
      trim: true,
    },
    imgUrl: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Product = model("Products", productSchema);
