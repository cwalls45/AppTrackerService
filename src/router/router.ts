import express from 'express';
import createApplication from '../controllers/chemicalApplication/createApplication';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('router endpoint')
});

router.post('/createApplication', createApplication);

export default router;