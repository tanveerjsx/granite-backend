const router = require('express').Router();
const categoryService = require('./../services/categoryService');

const authenticated = require('../middleware/authenticate');

router.get('/', async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      message: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get('/categoryId', async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.categoryId);
    res.status(200).json({
      message: category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post('/', authenticated, async (req, res) => {
  const category = categoryService.categoryObject(req.body);
  try {
    const savedCategory = await categoryService.categorySave(category);
    res.status(201).json({
      message: savedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.patch('/:id', authenticated, async (req, res) => {
  try {
    const updatedCategory = await categoryService.categoryUpdate(req.params.id, req.body);
    if (!updatedCategory) res.status(404).json({ message: 'category not found' });
    res.status(200).json({
      message: updatedCategory,
    });
  } catch (error) {
    res.json({ messsage: error });
  }
});

router.delete('/:id', authenticated, async (req, res) => {
  try {
    const deleteCategory = await categoryService.deleteCategory(req.params.id);
    if (!deleteCategory) res.status(404).json({ message: 'category not found' });
    res.status(200).json({
      message: deleteCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;
