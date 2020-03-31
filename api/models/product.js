const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  finalPrice:{type:Number},
  stock: { type: Number, required: true },
  description: { type: String },
  offer: { type: Number, default: 0 },
  productPic: [
    {
      img: String,
    },
  ],
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
      review: {type:String, required:true},
      rating:{type:Number, required:true},
      date: {type:Date, default:Date.now},
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sku: { type: String, unique:true, required:true },
  isPublish:{type:Boolean, required:true},
  views:{type:Number},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // updatedAt: Date,
  // updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Product', productSchema);
