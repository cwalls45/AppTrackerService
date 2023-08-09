import express from "express";
import createRegisteredPesticideFromFile from "../controllers/registeredPesticides/createRegisteredPesticideFromFile";
import getRegisteredPesticidesByCompany from "../controllers/registeredPesticides/getRegisteredPesticideByCompany";
import addCompaniesToCompanyRecord from "../controllers/registeredPesticides/addCompaniesToCompanyRecord";

const registeredPesticidesRouter = express.Router();

registeredPesticidesRouter.post('/createPesticide/file', createRegisteredPesticideFromFile);

registeredPesticidesRouter.get('/getPesticides/company/:companyName', getRegisteredPesticidesByCompany);

registeredPesticidesRouter.post('/addCompanies', addCompaniesToCompanyRecord)

export default registeredPesticidesRouter;