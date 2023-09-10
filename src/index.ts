import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routers/router';
import authRouter from './routers/authRouter';
import AWS from 'aws-sdk';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import registeredPesticidesRouter from './routers/registeredPesticidesRouter';
import authorize from './controllers/auth/authorize';
const serverless = require('serverless-http');
const cors = require('cors');

dotenv.config();
dayjs.extend(utc);

const app: Express = express();

const corsOptions = {
    origin: 'http://localhost:8080',
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authorize)

app.use('/auth', authRouter);

// Route Handlers
app.use('/registeredPesticides', registeredPesticidesRouter);
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