import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './router/router';
const serverless = require('serverless-http');
const cors = require('cors');

dotenv.config();

const app: Express = express();

const corsOptions = {
    origin: 'http://localhost:8080',
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Handlers
app.use('/api', router);

//Default Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

module.exports.handler = serverless(app);