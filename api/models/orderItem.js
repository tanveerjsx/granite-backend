const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
});

module.exports = mongoose.model('OrderItem', orderItemSchema);