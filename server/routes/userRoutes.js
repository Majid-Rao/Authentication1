import { Router } from "express";
import { validateTokens } from "../middlewares/authMiddleware.js";
import { userData } from "../controllers/userController.js";
const router = Router();
router.route('/data').get(validateTokens,userData);
export default router;