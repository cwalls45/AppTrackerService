import express from "express";
import login from "../controllers/auth/login";
import signUp from "../controllers/auth/signUp";

const authRouter = express.Router();

authRouter.post('/signUp', signUp);

authRouter.post('/login', login);

export default authRouter;