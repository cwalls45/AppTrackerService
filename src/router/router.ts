import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('router endpoint')
});

router.post('/createApplication', (req, res) => {
    res.send(req.body);
});

export default router;