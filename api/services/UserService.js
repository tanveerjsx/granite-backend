const User = require('../models/user');
const registerUser = user => {
  return user.save();
};
const getUserByEmail = email => {
  return User.findOne({ email }); 
};
const getAllVendors = role => {
  return User.find({ role }).populate('products');
};
const getAllUsers = role => {
  return User.find({ role })
};
const getVendor = id => {
  return User.findOne({ _id: id }).populate('products');
};
const findAll = () => {
  return User.find({}).select('-products');
};
const getUser = id => {
  return User.findOne({ _id: id });
};
const getUserUpdate = _id => {
  return User.findOne({ _id }).select('-products');
};
const findOneUser=id=>{
  return User.findOne({_id:id});
}


const userService = {
  registerUser,
  findOneUser,
  getUserByEmail,
  getAllVendors,
  getVendor,
  findAll,
  getUser,
  getUserUpdate,
  getAllUsers
};
module.exports = userService;
