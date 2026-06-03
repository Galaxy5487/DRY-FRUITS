import mongoose from "mongoose";

const shopInfoSchema = new mongoose.Schema(
  {
    shopName: { type: String, default: "NR Dry Fruit" },
    ownerName: { type: String, required: true },
    ownerPhoto: String,
    ownerDescription: String,
    contactDetails: {
      phone: String,
      email: String,
      whatsapp: String
    },
    shopAddress: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    googleMapsEmbedUrl: String
  },
  { timestamps: true }
);

export const ShopInfo = mongoose.model("ShopInfo", shopInfoSchema);
