import express from "express";
import login from "../controllers/auth/login";
import createUser from "../controllers/auth/createUser";

const authRouter = express.Router();

authRouter.post('/createUser', createUser);

authRouter.post('/login', login);

export default authRouter;