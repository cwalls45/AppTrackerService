import express from "express";
import login from "../controllers/auth/login";
import createUser from "../controllers/auth/createUser";
import addCourseInfo from "../controllers/auth/addCourseInfo";
import addCourseAreas from "../controllers/auth/addCourseAreas";
import getUser from "../controllers/auth/getUser";

const authRouter = express.Router();

authRouter.post('/createUser', createUser);

authRouter.post('/addCourseInfo', addCourseInfo);

authRouter.post('/addCourseAreas', addCourseAreas);

authRouter.get('/user', getUser);

authRouter.post('/login', login);

export default authRouter;