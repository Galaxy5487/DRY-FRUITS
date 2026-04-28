import { Coupon } from "../models/Coupon.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { ShopInfo } from "../models/ShopInfo.js";
import { User } from "../models/User.js";
import { defaultCoupons, defaultProducts, defaultShopInfo, defaultUsers } from "./defaultData.js";

export const bootstrapData = async () => {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    return;
  }

  const createdUsers = await Promise.all(defaultUsers.map((user) => User.create(user)));
  const createdProducts = await Product.insertMany(defaultProducts);

  await Review.insertMany([
    {
      userId: createdUsers[1]._id,
      productId: createdProducts[0]._id,
      rating: 5,
      comment: "Fresh, crunchy, and very premium packaging."
    },
    {
      userId: createdUsers[1]._id,
      productId: createdProducts[2]._id,
      rating: 4,
      comment: "Sweet and clean raisins, great for daily use."
    }
  ]);

  await ShopInfo.create(defaultShopInfo);
  await Coupon.insertMany(defaultCoupons);
};
