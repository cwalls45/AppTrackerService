import { Request, Response } from 'express';
import { ApplicationGateway } from '../../gateways/applicationGateway';
import { IApplication } from '../../entities/application';

const getApplications = async (req: Request, res: Response) => {
    const applicationGateway = new ApplicationGateway();

    const year = Number(req.params.year);
    const accountId = req.params.accountId;

    const applications: IApplication[] = await applicationGateway.getApplicationsByYear(year, accountId);
    res.send({ applications })
}

export default getApplications