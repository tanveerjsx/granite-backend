const mongoose = require('mongoose');
const billingDetailSchema = mongoose.Schema({
    firstName:{type: String, required:true},
    lastName:{type: String, required:true},
    companyName:{type: String, defualt:''},
    country:{type:String,required:true},
    streetAddress:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    postCode:{type:Number,required:true},
    phone:{type:String,required:true},
    email:{type:String,required:true}
});

module.exports = mongoose.model('BillingDetail',billingDetailSchema);