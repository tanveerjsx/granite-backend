const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now() },
    bill:{ type: mongoose.Schema.Types.ObjectId, ref: 'BillingDetail' },
    total:{type:Number,required:true}
});
 
module.exports = mongoose.model('Order', orderSchema); 