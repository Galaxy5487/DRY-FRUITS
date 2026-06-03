export const calculateOrderTotals = ({ items, coupon }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const shippingFee = subtotal > 1500 ? 0 : 99;
  const discountAmount = coupon
    ? coupon.discountType === "percentage"
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : coupon.discountValue
    : 0;
  const totalAmount = Math.max(subtotal + shippingFee - discountAmount, 0);

  return {
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount
  };
};
