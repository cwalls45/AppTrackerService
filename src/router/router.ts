import express from 'express';
import createApplication from '../controllers/chemicalApplication/createApplication';
import getApplicationEvents from '../controllers/chemicalApplication/getApplicationEvents';
import getByPartialChemicalName from '../controllers/chemicalApplication/partialChemicalName';

const router = express.Router();

router.get('/applicationEvents', getApplicationEvents);

router.get('/partialChemicalName/:chemical', getByPartialChemicalName);

router.post('/createApplication', createApplication);

export default router; 