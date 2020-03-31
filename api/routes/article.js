const router = require('express').Router();
const articleService = require('./../services/articleService');
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
  storage,
});

router.post('/', authenticated, upload.single('articlePic'), async (req, res) => {
  const article = articleService.articleObject(req);
  try {
    const savedArticle = await articleService.articleSave(article);
    res.status(201).json({
      message: 'Article added successfully',
      data: savedArticle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const article = await articleService.getAllArticles();
    res.status(200).json({
      message: article,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    res.status(200).json({
      message: article,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/view/:id', authenticated, async (req, res) => {
  try {
    const viewArticle = await articleService.articleAddView(req.params.id);
    res.status(200).json({
      message: viewArticle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/publish/:id', authenticated, async (req, res) => {
  try {
    const article = await articleService.articlePublish(req.params.id);
    if (!article) res.status(404).json({ message: 'article not found' });
    article.isPublished = !article.isPublished;
    const changeUpdate = await articleService.articleSave(article);
    res.status(200).json({
      message: 'data updated',
      data: changeUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

router.patch('/:id', authenticated, async (req, res) => {
  try {
    const updatedArticle = await articleService.articleUpdate(req.params.id, req.body);
    if (!updatedArticle) res.status(404).json({ message: 'article not found' });
    res.status(200).json({
      message: updatedArticle,
    });
  } catch (error) {
    res.json({ messsage: error });
  }
});

router.delete('/:id', authenticated, async (req, res) => {
  try {
    const deleteArticle = await articleService.deleteArticle(req.params.id);
    if (!deleteArticle) res.status(404).json({ message: 'article not found' });
    res.status(200).json({
      message: deleteArticle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
