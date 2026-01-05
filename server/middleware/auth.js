import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protect = async (req,res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return res.json({success: false, messgae :"token not found"})
    }

    try {
        const userId = jwt.decode(token, process.env.JWT_SECRET)

        if(!userId){
        return res.json({success: false, messgae :"user - not authorized"})
    }

    req.user = await User.findById(userId).select("-password")
    next();

    } catch (error) {
        return res.json({success: false, messgae :"Failed to protect"})
    }
}
