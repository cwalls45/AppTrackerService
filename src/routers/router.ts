import express from 'express';
import createApplication from '../controllers/chemicalApplication/createApplication';
import getApplicationEvents from '../controllers/chemicalApplication/getApplicationEvents';
import getCompaniesByProductName from '../controllers/chemicalApplication/getCompaniesByProductName';
import getByPartialChemicalName from '../controllers/chemicalApplication/getPartialChemicalName';
import addInventory from '../controllers/inventory/addInventory';
import getAllInventory from '../controllers/inventory/getAllInventory';
import getApplications from '../controllers/chemicalApplication/getApplications';

const router = express.Router();

router.get('/applicationEvents/:year/:accountId', getApplicationEvents);

router.get('/partialChemicalName/:chemical', getByPartialChemicalName);

router.get('/companyNamesByProduct/:productName', getCompaniesByProductName);

router.post('/createApplication', createApplication);

router.get('/getApplications/:year/:accountId', getApplications);

router.post('/addInventory', addInventory);

router.get('/getAllInventory/:accountId', getAllInventory);

export default router; 