import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { user } from "../models/user.model.js"
import { uploadResult} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const register = asyncHandler( async (req,res)=>{
   //get user details from frontend
   //validation not empty
   // check if user already exist: username and email
   //check for images , check for avatar
   //upload them to cloudinary, avatar
   // create user object - create entry in db
   //remove password and refresh token field from the response
   //check for user creation.
   //return response

   const {fullName, email, username, password}=req.body
//    if(fulName == "")
//    {
//     throw new ApiError(404,"Fullname is required")
//    }

    if([fullName,email,username,password].some((field)=>field?.trim()===""))
    {
        throw new ApiError(400, "ALl fields are compulsory are required")
    }
    if(!email.includes("@"))
    {
        throw new ApiError(404,"Enter valid email Address");
    }

    // const u1 = user.findOne({fullName});
    // if(u1 == fullName)
    // {
    //     throw new ApiError(100,"The username already exist give some new name")
    // }
   
    const existedUser = user.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser)
    {
        throw new ApiError(409,"User with email or username exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath)
    {
        throw new ApiError(400, "Avatar file is required")
    }


    const avatar = await uploadResult(avatarLocalPath)
    const coverImage = await uploadResult(coverImageLocalPath)

    if(!avatar)
    {
        throw new ApiError(404, "  ")
    }

    const user = user.create({fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url||"",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await user.findById(user._id).select(
        "-password -refreshToken  "
    )

    if(!createdUser)
    {
        throw new ApiError(500, "User not created")
    }

        return res.status(201).json(
            new ApiResponse(201,createdUser,"User registedred Successfully")
        )

})

export{register}