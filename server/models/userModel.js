const mongoose =require('mongoose')

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: [true,'Please add a username'],
        unique:true,
        trim:true,  
    },
    email:{
        type:String,
        required: [true,'Please add email'],
        unique:true,
        trim:true,  
    },
    contactNo:{
        type:String,
        required: [true,'Please add number'],
        trim:true,
    },
    DOB:{
        type:String,
        required: [true,'Please add your date of birth'],
        trim:true,  
    },
    password:{
        type:String,
        required: [true,'Please add password'],
        min:6,
        max:64,
        unique:true,  
    },
    role:{
        type:String,
        default:'admin'
    }

},
{timestamps:true}
);

module.exports=mongoose.model('User',userSchema);