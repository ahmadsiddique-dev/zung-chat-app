import { Router } from "express"
import {
    handleRefresh,
    logoutController,
    userLoginControler,
    userSignupControler,
} from "../controllers/auth.controller.js"
import { getAllUsers, getUserById, searchUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const authRouter = Router(); 

authRouter.route("/login").post(userLoginControler);
authRouter.route("/signup").post(userSignupControler);
authRouter.route("/refresh").get(verifyToken, handleRefresh);
authRouter.route("/logout").post(logoutController);

// User management routes
authRouter.route("/users").get(verifyToken, getAllUsers);
authRouter.route("/users/search").get(verifyToken, searchUsers);
authRouter.route("/users/:id").get(verifyToken, getUserById);
 
export default authRouter;