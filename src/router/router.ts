import express from 'express';
import createApplication from '../controllers/chemicalApplication/createApplication';
import getApplicationEvents from '../controllers/chemicalApplication/getApplicationEvents';

const router = express.Router();

router.get('/applicationEvents', getApplicationEvents);

router.post('/createApplication', createApplication);

export default router; 