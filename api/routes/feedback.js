const router = require('express').Router();
const feedbackService = require('./../services/feedback');
const authenticated = require('../middleware/authenticate');

router.post('/', authenticated, async (req, res) => {
  const feedback = feedbackService.feedbackObject(req.body);
  try {
    const SavedFeedback = await feedbackService.feedbackSave(feedback);
    res.status(201).json({
      message: 'Feedback added successfully',
      data: SavedFeedback,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.status(200).json({
      message: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

router.delete('/:id', authenticated, async (req, res) => {
  try {
    const deleteFeedback = await feedbackService.deleteFeedback(req.params.id);
    if (!deleteFeedback) res.status(404).json({ message: 'feedback not found' });
    res.status(200).json({
      message: deleteFeedback,
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
});

module.exports = router;
