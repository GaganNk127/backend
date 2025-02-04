import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_NAME,
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});



const uploadResult = async ( localfilepath )=> await cloudinary.uploader.upload(
           localfilepath, {
               resource_type : "auto"
           },
           fs.unlink(localfilepath)
           
       )
       .catch((error) => {
            fs.unlinkSync(localfilepath)// remove the temperoary saved local file path from the upload.
           console.log(error);
       });
    
    console.log(uploadResult);


    export {uploadResult}