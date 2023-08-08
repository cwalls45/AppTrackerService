import express from "express";
import createRegisteredPesticideFromFile from "../controllers/registeredPesticides/createRegisteredPesticideFromFile";

const registeredPesticidesRouter = express.Router();

registeredPesticidesRouter.post('/createPesticide/file', createRegisteredPesticideFromFile);

export default registeredPesticidesRouter;