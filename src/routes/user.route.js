import {Router} from "express";
import {register, loginuser,refreshAccessToken} from "../controllers/user.controller.js"

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

// session logout routes
router.route('/logout').post(verifyJWT, log)
router.route('/refersh_token').post(refreshAccessToken)

export default router