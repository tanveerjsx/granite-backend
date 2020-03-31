const router = require('express').Router();
const productService = require('./../services/productService');
const authenticated = require('../middleware/authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now().toString() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.get('/reviews', async (req, res) => {
  try {
    const reviews = await productService.getAllReviews();

    res.status(200).json({
      message: reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post('/', authenticated, upload.single('productPic'), async (req, res) => {
  const product = productService.ProductObject(req);
  try {
    const SavedProduct = await productService.productSave(product);
    res.status(201).json({
      message: 'Product added successfully',
      data: SavedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      message: products,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getVendorProducts(req.params.id);
    res.status(200).json({
      message: product,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

router.get('/view/:id', authenticated, async (req, res) => {
  try {
    const viewProduct = await productService.productAddView(req.params.id);
    if (!viewProduct) res.status(404).json({ message: 'product not found' });
    res.status(200).json({
      message: viewProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.patch('/review/:id', authenticated, async (req, res) => {
  try {
    const product = await productService.getSingleProduct(req.params.id);
    if (!product) res.status(404).json({ message: 'product not found' });
    product.reviews.push(req.body);
    const saveProduct = await productService.productSave(product);
    res.status(200).json({
      message: saveProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/store/:id', authenticated, async (req, res) => {
  try {
    const product = await productService.getSingleProduct(req.params.id);
    if (!product) res.status(404).json({ message: 'product not found' });
    product.isPublish = !product.isPublish;
    const changeUpdate = await productService.productSave(product);
    res.status(200).json({
      message: 'product updated',
      data: changeUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.patch('/:id', authenticated, async (req, res) => {
  try {
    const updatedProduct = await productService.productUpdate(req.params.id, req.body);
    if (!updatedProduct) res.status(404).send({ message: 'product not found' });
    res.status(200).json({
      message: updatedProduct,
    });
  } catch (error) {
    res.json({ messsage: error.message });
  }
});

router.delete('/:id', authenticated, async (req, res) => {
  try {
    const deleteProduct = await productService.deleteProduct(req.params.id);
    if (!deleteProduct) res.status(404).json({ message: 'product not found' });
    res.status(200).json({
      message: deleteProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
