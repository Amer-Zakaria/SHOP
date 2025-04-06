import { Schema, model } from "mongoose";

const categorySchema: Schema = new Schema(
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
      minLength: 1,
      maxLength: 1000,
      unique: true,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Category = model("Categories", categorySchema);
