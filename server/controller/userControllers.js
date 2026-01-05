import User from "../model/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../model/Car.js"

const gernateToken = (userId) => {
   const payload = userId;
   return jwt.sign(payload, process.env.JWT_SECRET)
}

export const registerUser = async (req,res) => {
   try {
     const {name, email, password} = req.body

     if(!name || !email || !password || password.length < 8){
        return res.json({success: false, messgae:'All fileds required'})
     }

     const userExists = await User.findOne({email})

     if(userExists){
      return res.json({success:false, messgae:"User already exists"})
     }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
      name, email, password:hashedPassword})

      const token  = gernateToken(user._id.toString())
      
      res.json({success: true, token, message:"user register successfully"})


   } catch (error) {
         console.log(error.messgae);
         res.json({success:false, messgae:"error occured while user register"})
         
   }
}

export const userLogin = async(req, res) => {
   try {
      const {email, password} = req.body;

      const user = await User.findOne({email})

      if(!user){
         return res.json({success:false, message: "user not found"})
         
      }

      const isMatched = await bcrypt.compare(password, user.password)

      if (!isMatched) {
         return res.json({success:false, message: "invalid credentails"})
      }

      const token = gernateToken(user._id.toString())
      res.json({success:true, token,message:"user login successfully"})

      
   } catch (error) {
      console.log(error.messgae);
      return res.json({success:false, message: "user failed to login"})
      
   }
}



export const getUserData = async(req, res) => {
   try {
      const {user} = req;
      res.json({success:true, user,  message: "login successfullt"})

   } catch (error) {
      console.log(error.messgae);
      return res.json({success:false, message: "user data faild to fetch"})
   }
}



export const getCars = async (req, res) => {
   try {

      const cars = await Car.find({isAvaliable: true})

      res.json({ success: true, cars, message: "Data fetched successfully"
      })

   } catch (error) {
      console.log(error.message);
      return res.json({ success: false, message: "Failed to fetch" })
   }
}