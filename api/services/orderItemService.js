const OrderItemModel = require('../models/orderItem');
const saveItem = (order, product, quantity) => {
  const newItem = new OrderItemModel({
    order,
    product,
    quantity,
  });
  return newItem.save();
};
const OrderItemService = {
  saveItem,
};
module.exports = OrderItemService;
