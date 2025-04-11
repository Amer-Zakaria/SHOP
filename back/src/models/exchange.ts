import { Schema, model } from "mongoose";

const exchangeSchema: Schema = new Schema(
  {
    exchange: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Exchange = model("Exchange", exchangeSchema);
