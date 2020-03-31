const router = require('express').Router();
const couponService = require('./../services/coponService');
const authenticated = require('../middleware/authenticate');

router.post('/', authenticated, async (req, res) => {
  const coupon = couponService.couponObject(req.body);
  try {
    const SavedCoupon = await couponService.couponSave(coupon);
    res.status(201).json({
      message: 'Coupon added successfully',
      data: SavedCoupon,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.status(200).json({
      message: coupons,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    res.status(200).json({
      message: coupon,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

router.patch('/:id', authenticated, async (req, res) => {
  try {
    const updatedCoupon = await couponService.couponUpdate(req.params.id, req.body);
    if (!updatedCoupon) res.status(404).json({ message: 'coupon not found' });
    res.status(200).json({
      message: updatedCoupon,
    });
  } catch (error) {
    res.json({ messsage: error });
  }
});

router.delete('/:id', authenticated, async (req, res) => {
  try {
    const deleteCoupon = await couponService.deleteCoupon(req.params.id);
    if (!deleteCoupon) res.status(404).json({ message: 'coupon not found' });
    res.status(200).json({
      message: deleteCoupon,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

module.exports = router;
