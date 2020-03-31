const OrderModel = require('../models/order');
const saveOrder = (user, total, bill) => {
  const newOrder = new OrderModel({
    user,
    bill,
    total,
  });
  return newOrder.save();
};
const OrderService = {
  saveOrder,
};
module.exports = OrderService;
