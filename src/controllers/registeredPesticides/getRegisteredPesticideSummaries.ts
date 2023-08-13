import { Request, Response } from 'express';
import { RegisteredPesticideGateway } from '../../gateways/registeredPesticideGateway';
import { IRegisteredPesticideSummary } from '../../entities/chemical';

const getRegisteredPesticideBySummaries = async (req: Request, res: Response) => {
    const registeredPesticideGateway = new RegisteredPesticideGateway();
    const epaNumber = req.params.epaNumber;

    const response = await registeredPesticideGateway.getRegisteredPesticideSummaries(epaNumber) as IRegisteredPesticideSummary[];
    res.send({ registeredPesticides: response });
};

export default getRegisteredPesticideBySummaries;