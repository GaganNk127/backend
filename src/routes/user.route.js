import {Router} from "express";
import {register, loginuser} from "../controllers/user.controller.js"

import { upload } from "../middlewares/multer.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    register)

router.route('/login').post(loginuser);

export default router