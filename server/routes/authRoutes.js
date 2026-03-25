import { Router } from "express"
import { validateTokens } from "../middlewares/authMiddleware";
import {upload} from "../middlewares/multerMiddleware";
import { authLimiter } from "../middlewares/rateMiddleware";
import { registerUser,loginUser,logoutUser,reassign } from "../controllers/authController";
const router = Router();

router.route('/register').post(
    upload.fields([
        {
           name : "coverImage" , maxCount:1
        }
    ])
    ,authLimiter,registerUser);
