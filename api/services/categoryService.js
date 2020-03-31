const Category = require('../models/category');

const getAllCategories = () => {
  return Category.find().populate('products');
};
const getCategoryById = category => {
  return Category.find({ createdBy: category }).populate('products');
};
const categoryObject = req => {
  return new Category({
    name: req.name,
    createdAt: new Date(),
    createdBy: req.createdBy,
  });
};
const categorySave = category => {
  return category.save();
};

const categoryUpdate = (user, data) => {
  return Category.findByIdAndUpdate({ _id: user }, { $set: { ...data } }, { new: true });
};

const deleteCategory = user => {
  return Category.findByIdAndDelete({ _id: user });
};

const categoryService = {
  getAllCategories,
  getCategoryById,
  categoryObject,
  categorySave,
  categoryUpdate,
  deleteCategory,
};
module.exports = categoryService;
