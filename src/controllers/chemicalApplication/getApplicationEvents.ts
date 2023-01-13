import { Request, Response } from 'express';
import { ApplicationEventGateway } from '../../gateways/applicationEventGateway';

const getApplicationEvents = async (req: Request, res: Response) => {
    //TODO get year and accound id from req once it is passed from the client
    const applicationEventGateway = new ApplicationEventGateway();
    const applicationEvents = await applicationEventGateway.getApplicationEventsByYear(2023, 'accountId-123');
    //TODO: get application events once database is set up
    res.locals.events = applicationEvents;
    res.send(res.locals.events);
};

export default getApplicationEvents;