import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadResult} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { upload } from "../middlewares/multer.js"

const generateAccessTokenandRefreshToken = async(userId)=>{
   
   try{
    const user = await User.findById(userId);
    const accessToken = User.generateAccessToken();
    const refreshToken = User.generateRefreshToken();

    user.refreshToken = refreshToken;// we store the refresh token in database also
    await user.save({validateBeforeSave : false})// validation 
    return {accessToken,refreshToken}
   } catch(e){
    throw new ApiError(500, "We are uable to generate accessToken");
   }

    
}



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
   
    const existedUser = await user.findOne({
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

    const user = User.create({fullName,
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


const loginuser = asyncHandler(async (req,res)=>{
    const {username, email, password} = req.body;

    if([username,email,password].some((field)=>field == ""))
    {
        throw new  ApiError(404, "All fields are necessary");
    }

    const user = await User.findOne(
        $or = [{username},{email}]);

    if(!user)
    {
        throw new  ApiError(404, "The user is not there");
    }

    const ispasswordvalid = await user.isPasswordCorrect(password);

    if(!ispasswordvalid)
    {
        throw new ApiError(404, "Password invalid")
    }

    const {accessToken, refreshToken} = await generateAccessTokenandRefreshToken(User._id);
    const loggeginuser = await User.findById(user.__id)
    .select("-password -refreshToken")

    const options = {
        httpOnly :true,
        secure:true // this make it imposible to modify the cookies from frontend and only server can modify it
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(200,{
            user: loggeginuser,accessToken,refreshToken
        },
    "user logged in succefully")
    )

const logoutUser = asyncHandler( async(req,res)=>{
     await User.findByIdandUpdate(
        req.user.__id,
        {
            $set : {
                refreshToken : undefined
            }
        }
    )
    const options = {
        httpOnly :true,
        secure:true // this make it imposible to modify the cookies from frontend and only server can modify it
    }

    return res.status(200)
    .clearcookies("accessToken",options)
    .clearcookies("refreshToken",options)
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingrefreshToken){
    throw new ApiError(401, "no refresh token")
   }

   const verified = jwt.verify(incomingrefreshToken,process.env.REFERSH_TOKEN_SECRET)
   const user = await User.findById(verified?.__id);
   if(!user)
   {
    throw new ApiError(401, "Invalid refresh token")
   }
   if(incomingrefreshToken !== user?.refreshToken)
   {
    throw new ApiError(401, "refresh token is ecpired or used")
   }

   const options = {
    httpOnly : true,
    secure : true
   }

  const {accessToken,newrefreshToken} = await generateAccessTokenandRefreshToken(user.__id)

   req.status(200).cookies("newrefreshToken",options).cookies("accessToken",options).json(
    new ApiResponse(200,
        {accessToken, refreshToken : newrefreshToken},"Access Token refershed successfully"
     )
   ) 

})

})


const changeCurrentPassword = asyncHandler(
    async(req,res)=>{
        const {oldPassword,newPassword} = req.body

       const user =  await User.findById(req.User?.id)

        const ispasswordvalid = await user.isPasswordCorrect(oldPassword)
        if(!ispasswordvalid)
        {
            throw new ApiError(400, "Invalid Old Password")
        }

        user.password = newPassword
        await user.save({validateBeforeSave : false})

        return res.status(200).json(new ApiResponse(200, {}, "Password changed Successfully"))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,
        req.user,"current user fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body
    if(!fullName || !email)
    {
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName : fullName,
                email : email
            }
        },
        {new : true}
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Account deatils Updated" ))

})


const updateUserAvatar = asyncHandler(async(req,res)=>{
     const avatarLocalPath = req.file?.path

     if(!avatarLocalPath)
     {
        throw new ApiError(400, "Avatar File is missing")
     }

     const avatar = await upload(avatarLocalPath)

     if(!avatar.url)
     {
        throw new ApiError(400, " Error while uploading on avatar")
     }

     const user = await user.findByIdAndUpdate(req.user._id,
        {
            $set : {
                avatar : avatar.url
            }
        },
        {
            new : true
        }
     ).select("-password")

     res.status(200).json(new ApiResponse(200, user, "Updated user and changed avatar"))
})

export{register,
    loginuser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
}