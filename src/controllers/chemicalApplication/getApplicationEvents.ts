import { Request, Response } from 'express';
import { ApplicationGateway } from '../../gateways/applicationGateway';

const getApplicationEvents = async (req: Request, res: Response) => {
    const year = Number(req.params.year);
    const accountId = req.params.accountId;
    const applicationGateway = new ApplicationGateway();
    const applicationEvents = await applicationGateway.getApplicationEventsByYear(year, accountId);
    res.locals.events = applicationEvents;
    res.send(res.locals.events);
};

export default getApplicationEvents;