import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/auth/auth.controller";
import { SearchUserController } from "../controllers/search_user/searchUser.controller";
import { authenticateToken } from "../middleware/authMiddleware";
// const apiLogger = require("../middleware/apiLogger");
// const {
//   authenticateToken,
//   authorizeRole,
// } = require("../middleware/authMiddleware");

//route
// router.use(authenticateToken, apiLogger, authorizeRole(1));

// router.get("/mapAll", AllChoiceController.mapAll);
router.get("/search-user", SearchUserController.searchUser);

// register
router.post("/register", AuthController.register);
// login
router.post("/login", AuthController.login);
// logout
router.post("/logout", authenticateToken, AuthController.logout); // ✅ ตรวจ token ก่อน
// me
router.get("/me", authenticateToken, AuthController.me);
router.get("/check-token", AuthController.checkToken);

export default router;
