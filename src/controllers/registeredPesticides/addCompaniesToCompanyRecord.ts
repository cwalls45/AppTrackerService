import { Request, Response } from 'express';
import { RegisteredPesticideGateway } from '../../gateways/registeredPesticideGateway';

const addCompaniesToCompanyRecord = async (req: Request, res: Response) => {
    const registeredPesticideGateway = new RegisteredPesticideGateway();
    const { companies }: { companies: string[] } = req.body;

    try {
        await registeredPesticideGateway.createPesticideCompanyRecord(companies);
        res.status(200);
    } catch (error) {
        console.log('ERROR adding companies to company record: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error adding companies to company record: ${JSON.stringify(req.body.pesticide, null, 2)}` });
    }
};

export default addCompaniesToCompanyRecord;