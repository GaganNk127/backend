import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {user} from "../models/user.model.js"

export const verifyJWT = asyncHandler(try {
    async(req,res,next)=>{
        const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer","")
    
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)// here we verify the recieved token and the jwt token
        
       const user = await User.findById(decoded?.__id).select("-password refreshToken")// here we find the id based on the accestoken check the user model for more clarification
    
       if(!user)
       {
        throw new ApiError(401, "Invalide Access Token")
       }
    
       req.user = user
    }
} catch (error) {
    
})