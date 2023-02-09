import express from "express";
import signUp from "../controllers/auth/signUp";

const authRouter = express.Router();

authRouter.post('/signUp', signUp);

export default authRouter;