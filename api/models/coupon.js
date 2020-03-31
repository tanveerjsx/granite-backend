const mongoose=require('mongoose')


const couponschema= new mongoose.Schema({
  code: { type: String,unique:true, required: true },
  type: { type:String, required: true },
  amount: { type: Number, required: true },
  owner: { type:mongoose.Schema.Types.ObjectId,ref:"User", required: true },
  usageLimit:{ type: String, required: true },
  expiry:{type:Date, required:true}
})  
module.exports=mongoose.model("Coupon",couponschema) 