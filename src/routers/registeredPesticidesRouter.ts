import express from "express";
import createRegisteredPesticideFromFile from "../controllers/registeredPesticides/createRegisteredPesticideFromFile";
import getRegisteredPesticidesByCompany from "../controllers/registeredPesticides/getRegisteredPesticideByCompany";
import addCompaniesToCompanyRecord from "../controllers/registeredPesticides/addCompaniesToCompanyRecord";
import createRegisteredPesticideSummary from "../controllers/registeredPesticides/createRegisteredPesticideSummary";
import getRegisteredPesticideBySummaries from "../controllers/registeredPesticides/getRegisteredPesticideSummaries";

const registeredPesticidesRouter = express.Router();

registeredPesticidesRouter.post('/createPesticide/file', createRegisteredPesticideFromFile);

registeredPesticidesRouter.get('/getPesticides/company/:companyName', getRegisteredPesticidesByCompany);

registeredPesticidesRouter.post('/addCompanies', addCompaniesToCompanyRecord);

registeredPesticidesRouter.post('/registeredPesticideSummary', createRegisteredPesticideSummary);

registeredPesticidesRouter.get('/registeredPesticideSummary/:epaNumber', getRegisteredPesticideBySummaries);


export default registeredPesticidesRouter;