import { Router } from "express"
import { validateTokens } from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/multerMiddleware.js";
import { authLimiter } from "../middlewares/rateMiddleware.js";
import { registerUser,loginUser,logoutUser,refreshAccessToken } from "../controllers/authController.js";
const router = Router();

router.route('/register').post(
    upload.fields([
        {
           name : "coverImage" , maxCount:1
        }
    ])
    ,authLimiter,registerUser);
router.route('/login').post(authLimiter,loginUser);
router.route('/logout').post(validateTokens,logoutUser);

export default router;