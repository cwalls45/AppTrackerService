import { Request, Response } from 'express';
import { ApplicationGateway } from '../../gateways/applicationGateway';

const getApplications = async (req: Request, res: Response) => {
    const applicationGateway = new ApplicationGateway();

    const year = Number(req.params.year);
    const accountId = req.params.accountId;

    const applications = await applicationGateway.getApplicationsByYear(year, accountId);
    res.send({ applications })
}

export default getApplications