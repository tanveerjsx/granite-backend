const Feedback = require('../models/feedback');

const getAllFeedbacks = () => {
  return Feedback.find({});
};

const feedbackObject = data => {
  return new Feedback({
    ...data,
  });
};
const feedbackSave = feedback => {
  return feedback.save();
};


const deleteFeedback = user => {
  return Feedback.findByIdAndDelete({ _id: user });
};

const feedbackService = {
  getAllFeedbacks,
  feedbackObject,
  feedbackSave,
  deleteFeedback
};
module.exports = feedbackService;
