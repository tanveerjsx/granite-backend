const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  articlePic:{ type: String },
  name:{type:String, required:true},
  isPublished:{type:Boolean},
  views:{type:Number},
  content:{type:String, required:true},
  owner:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
  date:{type:Date, default:Date.now },
});

module.exports = mongoose.model('Article', articleSchema);  
