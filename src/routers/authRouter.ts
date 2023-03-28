import express from "express";
import login from "../controllers/auth/login";
import createUser from "../controllers/auth/createUser";
import addCourseInfo from "../controllers/auth/addCourseInfo";

const authRouter = express.Router();

authRouter.post('/createUser', createUser);

authRouter.post('/addCourseInfo', addCourseInfo);

authRouter.post('/login', login);

export default authRouter;