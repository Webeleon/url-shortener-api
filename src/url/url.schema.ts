import mongoose from "mongoose";

export const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  nbClicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

export class Url {
  originalUrl: string;
  shortUrl: string;
  nbClicks: number;
}

export const urlModel = mongoose.model("Url", urlSchema);
