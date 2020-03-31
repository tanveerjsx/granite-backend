const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true, 
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: 'true' }],
  role: { type: mongoose.Schema.Types.ObjectId, ref: "role", required: 'true' },
  contact: { type: String },
  activate:{type:Boolean},
  profilePic: { type: String },
  storeName:{type:String},
  storeAddress:{type:String},
  rating:{type:Number,default:0}
});

module.exports = mongoose.model('User', userSchema);
