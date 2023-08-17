import { Request, Response } from 'express';
import { RegisteredPesticideGateway } from '../../gateways/registeredPesticideGateway';
import { IPesticideInformation } from '../../entities/chemical';

const getRegisteredPesticidesByCompany = async (req: Request, res: Response) => {
    const registeredPesticideGateway = new RegisteredPesticideGateway();
    const companyName = req.params.companyName;

    const response = await registeredPesticideGateway.getRegisteredPesticidesByCompany(companyName) as IPesticideInformation[];
    res.send({ registeredPesticides: response });
};

export default getRegisteredPesticidesByCompany;