const Article = require('../models/article');

const getAllArticles = () => {
    return Article.find().populate('owner','storeName ')
}
const getArticleById = (user) => {
  
    return Article.find({owner:user}).populate('owner','storeName -_id')
}
const articleObject = (article) => {
  const {body, file}=article
  return new Article({
   articlePic: file.path,
   name:body.name,
   isPublished:false,
   views:0,
   content:body.content,
   owner:body.owner,
   });
}
const articleSave = (article) => {
    return article.save()
}
const articleAddView = (user) => {
    return Article.findByIdAndUpdate({_id:user},{$inc:{views:1}},{new:true})
}
const articlePublish=user=>{
    return Article.findOne({_id:user});
}
const articleUpdate=(user, data)=>{
    return Article.findByIdAndUpdate({ _id: user },{$set: {...data}},{new:true});}

const deleteArticle=user=>{
    return Article.findByIdAndDelete({ _id: user});
}

const articleService = { 
   
    getAllArticles,
    getArticleById,
    articleObject,
    articleSave,
    articleAddView,
    articlePublish,
    articleUpdate,
    deleteArticle
  
}
module.exports = articleService;