import { env } from "../config/env.js";
import { ShopInfo } from "../models/ShopInfo.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getShopInfo = asyncHandler(async (req, res) => {
  const shopInfo = await ShopInfo.findOne();

  if (!shopInfo) {
    return res.json({
      shopName: "NR Dry Fruit",
      ownerName: "Naeem Raza",
      ownerPhoto: "",
      ownerDescription: "Premium dry fruits, nuts, seeds, and gifting assortments.",
      contactDetails: {
        phone: "+91 98765 43210",
        email: "hello@nrdryfruit.com",
        whatsapp: "+91 98765 43210"
      },
      shopAddress: "NR Dry Fruit, Main Market, Jaipur, Rajasthan",
      latitude: 26.9124,
      longitude: 75.7873,
      googleMapsEmbedUrl: env.googleMapsEmbedUrl
    });
  }

  res.json(shopInfo);
});

export const updateShopInfo = asyncHandler(async (req, res) => {
  const ownerPhoto = req.file ? `/uploads/${req.file.filename}` : req.body.ownerPhoto;
  const existing = await ShopInfo.findOne();

  const payload = {
    ...req.body,
    ownerPhoto: ownerPhoto || existing?.ownerPhoto
  };

  const shopInfo = existing
    ? await ShopInfo.findByIdAndUpdate(existing._id, payload, { new: true })
    : await ShopInfo.create(payload);

  res.json(shopInfo);
});
