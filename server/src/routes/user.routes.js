import { Router } from "express"
import {
    handleRefresh,
    userLoginControler,
    userSignupControler,
} from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/verifyToken.js";
const authRouter = Router(); 

authRouter.route("/login").post(userLoginControler);
authRouter.route("/signup").post(userSignupControler);
authRouter.route("/refresh").get(verifyToken, handleRefresh)
 
export default authRouter;