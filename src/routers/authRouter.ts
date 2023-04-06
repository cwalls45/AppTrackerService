import express from "express";
import login from "../controllers/auth/login";
import createUser from "../controllers/auth/createUser";
import addCourseInfo from "../controllers/auth/addCourseInfo";
import addCourseAreas from "../controllers/auth/addCourseAreas";

const authRouter = express.Router();

authRouter.post('/createUser', createUser);

authRouter.post('/addCourseInfo', addCourseInfo);

authRouter.post('/addCourseAreas', addCourseAreas)

authRouter.post('/login', login);

export default authRouter;