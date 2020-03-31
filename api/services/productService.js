const Product = require('../models/product');

const getAllProducts = () => {
  return Product.find().populate('category owner', 'storeName name');
};
const getVendorProducts = user => {
  return Product.find({ owner: user }).populate('owner category', 'storeName name');
};
const getSingleProduct = id => {
  return Product.findOne({ _id: id });
};

const getAllReviews = () => {
  return Product.find({})
    .select('owner')
    .populate('owner', 'storeName -_id ')
    .select('reviews')
    .populate('reviews.user', 'firstName storeName lastName -_id');
};

const getReviewsById = user => {
  return Product.find({ owner: user }).populate('owner category', 'storeName name');
};

const ProductObject = req => {
  const { body, file } = req;
  return new Product({
    name: body.name,
    price: body.price,
    finalPrice: body.finalPrice,
    stock: body.stock,
    description: body.description,
    productPic: [{ img: file.path }],
    sku: body.sku,
    category: body.category,
    isPublish: false,
    color: body.color,
    owner: body.owner,
    views: 0,
  });
};
const productSave = product => {
  return product.save();
};
const productAddView = user => {
  return Product.findByIdAndUpdate({ _id: user }, { $inc: { views: 1 } }, { new: true });
};

const productUpdate = (user, data) => {
  return Product.findByIdAndUpdate({ _id: user }, { $set: { ...data } }, { new: true });
};

const deleteProduct = user => {
  return Product.findByIdAndDelete({ _id: user });
};

const productService = {
  getAllProducts,
  getVendorProducts,
  getSingleProduct,
  getAllReviews,
  ProductObject,
  getReviewsById,
  productSave,
  productAddView,
  productUpdate,
  deleteProduct,
};
module.exports = productService;
