const mongoose=require('mongoose')
const customerschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    }

});
//const customer=mongoose.model('customer',customerschema)
module.exports=customerschema;