import { Request, Response } from 'express';
import { applicationEventsTestData } from '../../testData/getApplicationEventsTestData';

const getApplicationEvents = async (req: Request, res: Response) => {
    try {
        //TODO: get application events once database is set up
        const response = applicationEventsTestData
        res.locals.events = response;
        res.send(res.locals.events);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: 'There was an error fetching application events' });
    }
};

export default getApplicationEvents;