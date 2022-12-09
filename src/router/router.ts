import express from 'express';
import createApplication from '../controllers/chemicalApplication/createApplication';
import getApplicationEvents from '../controllers/chemicalApplication/getApplicationEvents';
import getCompaniesByProductName from '../controllers/chemicalApplication/getCompaniesByProductName';
import getByPartialChemicalName from '../controllers/chemicalApplication/getPartialChemicalName';

const router = express.Router();

router.get('/applicationEvents', getApplicationEvents);

router.get('/partialChemicalName/:chemical', getByPartialChemicalName);

router.get('/companyNamesByProduct/:productName', getCompaniesByProductName);

router.post('/createApplication', createApplication);

export default router; 