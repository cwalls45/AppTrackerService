import express from "express";
import login from "../controllers/auth/login";
import createUser from "../controllers/auth/createUser";
import addCourseInfo from "../controllers/auth/addCourseInfo";
import addCourseAreas from "../controllers/auth/addCourseAreas";
import getUser from "../controllers/auth/getUser";
import getUserByToken from "../controllers/auth/getUserByToken";
import signOut from "../controllers/auth/signOut";
import getStripePublishableKey from "../controllers/payment/getStripePublishableKey";

const authRouter = express.Router();

authRouter.post('/createUser', createUser);

authRouter.post('/addCourseInfo', addCourseInfo);

authRouter.post('/addCourseAreas', addCourseAreas);

authRouter.get('/user/:email', getUser);

authRouter.get('/user/token/:accessToken', getUserByToken);

authRouter.post('/login', login);

authRouter.post('/signOut', signOut);

export default authRouter;