import express from "express";
import createRegisteredPesticideFromFile from "../controllers/registeredPesticides/createRegisteredPesticideFromFile";
import getRegisteredPesticidesByCompany from "../controllers/registeredPesticides/getRegisteredPesticideByCompany";

const registeredPesticidesRouter = express.Router();

registeredPesticidesRouter.post('/createPesticide/file', createRegisteredPesticideFromFile);

registeredPesticidesRouter.get('/getPesticides/company/:companyName', getRegisteredPesticidesByCompany);

export default registeredPesticidesRouter;