import { Router } from "express"
import { validateTokens } from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/multerMiddleware.js";
import { authLimiter } from "../middlewares/rateMiddleware.js";
import { registerUser,loginUser,logoutUser,refreshAccessToken,currentUser,
changePassword,sendVerifyOtp,verifyEmail,sendPasswordOtp,verifyPassword } from "../controllers/authController.js";
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
router.route('/refresh-tokens').post(refreshAccessToken);
router.route('/current-user').get(validateTokens,currentUser);
router.route('/change-password').post(validateTokens,authLimiter,changePassword);
router.route('/send-verify-otp').post(validateTokens,authLimiter,sendVerifyOtp);
router.route('/verifyEmail').post(validateTokens,authLimiter,verifyEmail);
router.route('/send-reset-otp').post(authLimiter,sendPasswordOtp);
router.route('/verifyPassword').post(verifyPassword);
export default router;