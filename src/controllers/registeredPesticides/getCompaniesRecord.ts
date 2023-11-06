import { Request, Response } from 'express';
import { RegisteredPesticideGateway } from "../../gateways/registeredPesticideGateway";
import { ICompanyRecord } from '../../entities/companies/company';

const getCompanies = async (req: Request, res: Response) => {
    const registeredPesticideGateway = new RegisteredPesticideGateway();

    try {
        const response = await registeredPesticideGateway.getCompaniesRecord();
        const companies: ICompanyRecord[] = Object.values(response[0])
        res.send(companies);
    } catch (error) {
        console.log('ERROR getting companies: ', error);
        res.status(400).send({ error: 'There was an error getting companies.' });
    }
};

export default getCompanies;