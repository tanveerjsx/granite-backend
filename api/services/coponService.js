const Coupon = require('../models/coupon');

const getAllCoupons = () => {
  return Coupon.find().populate('owner', 'storeName ');
};
const getCouponById = user => {
  return Coupon.find({ owner: user }).populate('owner', 'storeName');
};
const couponObject = data => {
  return new Coupon({
    ...data,
  });
};
const couponSave = coupon => {
  return coupon.save();
};
const couponUpdate = (user, data) => {
  return Coupon.findByIdAndUpdate({ _id: user }, { $set: { ...data } }, { new: true });
};

const deleteCoupon = user => {
  return Coupon.findByIdAndDelete({ _id: user });
};

const couponService = {
  getAllCoupons,
  getCouponById,
  couponObject,
  couponSave,
  couponUpdate,
  deleteCoupon,
};
module.exports = couponService;
