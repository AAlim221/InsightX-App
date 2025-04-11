const JWT = require('jsonwebtoken');
const {hashPassword, comparePassword} = require('../helpers/authHelper');
const surveyorModel = require('../models/surveyorModel');
const bcrypt = require('bcryptjs');

const regController = async(req,res) => {
    try {
  const { name, gmail, surveyorID, password, confirmPassword, mobileNo, nidOrPassport } = req.body;
//validation
  
  if(!name){
    return res.status(400).send({
     success:false,
     message:'name is required'
    })
 }
 if(!gmail){
    return res.status(400).send({
     success:false,
     message:'gmail is required'
    })
 }
 if(!surveyorID){
    return res.status(400).send({
     success:false,
     message:'surveyorID is required'
    })
 }
 if(!password){
    return res.status(400).send({
     success:false,
     message:'password is required'
    })
 }
 if(!confirmPassword){
    return res.status(400).send({
     success:false,
     message:'rewrite the password'
    })
 }

 if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
 if(!mobileNo){
    return res.status(400).send({
     success:false,
     message:'mobileNo is required'
    })
 }
 if(!nidOrPassport){
    return res.status(400).send({
     success:false,
     message:'nidOrPassport is required'
    })
 }
  
    const existing = await surveyorModel.findOne({name})
    if (existing) {
      return res.status(400).json({ message: "Surveyor already exists" });
    }

    //Hash password
    const hashedPassword = await hashPassword(password);

    //Save surveyor details
                const surveyor = await surveyorModel({name, gmail, surveyorID,password:hashedPassword,confirmPassword:hashedPassword, mobileNo, nidOrPassport}).save();
                
                return res.status(201).send({
                    success:true,
                    message:'Registration successful'
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
        const logController  =async (req,res) => {
          try {
            const {gmail,password} = req.body
            //validation
            if(!gmail || !password){
                return res.status(500).send({
                    success:false,
                    message:"Please provide Gmail or Password"
                });  
            }
            //find surveyor
            const surveyor = await surveyorModel.findOne({gmail})
            if(!surveyor){
                return res.status(500).send({
                    success:false,
                    message:"surveyor not found"
                });   
            }
            //match password
            const match = await comparePassword(password,surveyor.password)
             if(!match){
                return res.status(500).send({
                    success:false,
                    message:"Invalid gmail or password"
                });   
             }
             //Token JWT 
             const token =await JWT.sign({_id:surveyor._id},process.env.JWT_SECRET,{
                expiresIn:'7d'
             })
             //undefined password
             surveyor.password = undefined;
             //Successful login  message
             res.status(200).send({
                success:true,
                message:"Login successfully!",
                token,
                surveyor,
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
        
        module.exports = {regController,logController};