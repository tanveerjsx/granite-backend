const mongoose=require('mongoose')


const feedbackschema= new mongoose.Schema({
  name: { type: String, required: true },
  email: { type:String, required: true },
  message: { type: String, required: true },
  owner: { type:mongoose.Schema.Types.ObjectId, ref:"User", required: true }
})  
module.exports=mongoose.model("Feedback",feedbackschema) 