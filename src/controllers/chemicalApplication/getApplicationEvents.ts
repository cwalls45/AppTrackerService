import { Request, Response } from 'express';
import { ApplicationEventGateway } from '../../gateways/applicationEventGateway';

const getApplicationEvents = async (req: Request, res: Response) => {
    const year = Number(req.params.year);
    const accountId = req.params.accountId;
    const applicationEventGateway = new ApplicationEventGateway();
    const applicationEvents = await applicationEventGateway.getApplicationEventsByYear(year, accountId);
    res.locals.events = applicationEvents;
    res.send(res.locals.events);
};

export default getApplicationEvents;