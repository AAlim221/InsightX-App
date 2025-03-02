const JWT = require('jsonwebtoken');
const {hashPassword, comparePassword} = require('../helpers/authHelper');
const userModel = require('../models/userModel');

//Register
const registerController = async(req,res) => {
    try {
        const {userName,email,contactNo,DOB,password,role} = req.body
            //validation
            if(!userName){
               return res.status(400).send({
                success:false,
                message:'user name is required'
               })
            }
            if(!email){
                return res.status(400).send({
                 success:false,
                 message:'email is required'
                })
             }
             if(!contactNo){
                return res.status(400).send({
                 success:false,
                 message:'contactNo is required'
                })
             }
             if(!DOB){
                return res.status(400).send({
                 success:false,
                 message:'date of birth is required'
                })
             }
             if(!password || password.length <8 ){
                return res.status(400).send({
                 success:false,
                 message:'password is required and 8 character long'
                })
            }
            if(!role){
                    return res.status(400).send({
                     success:false,
                     message:'role is required'
                    })
            }
            //existing user 
            const existingUser = await userModel.findOne({userName})
            if (existingUser){
               return res.status(500).send({
                success:false,
                message:'User name already taken'
               })
            }

            //Hash password
            const hashedPassword = await hashPassword(password);


            //Save user
            const user = await userModel({userName,email,contactNo,DOB,password:hashedPassword,role}).save();
            
            return res.status(201).send({
                success:true,
                message:'Registration successful please login'
            })
    }
    catch (error) {
        console.log(error)
        return res.status(508).send({
            success:true,
            message:"Error in register API",
            error,
        });
    }
};

//Login
const loginController  =async (req,res) => {
  try {
    const {email,password} = req.body
    //validation
    if(!email || !password){
        return res.status(500).send({
            success:false,
            message:"Please provide Email or Password"
        });  
    }
    //find user
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(500).send({
            success:false,
            message:"User not found"
        });   
    }
    //match password
    const match = await comparePassword(password,user.password)
     if(!match){
        return res.status(500).send({
            success:false,
            message:"Invalid username or password"
        });   
     }
     //Token JWT 
     const token =await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:'7d'
     })
     //undefined password
     user.password = undefined;
     //Successful login  message
     res.status(200).send({
        success:true,
        message:"Login successfully!",
        token,
        user,
     })

      } catch (error) {
    console.log(error)
    return res.status(500).send({
        success:false,
        message:"Error in login API",
        error,
    });
  }
};

module.exports = {registerController,loginController};