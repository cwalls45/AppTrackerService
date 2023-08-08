import { Request, Response } from 'express';
import { RegisteredPesticideGateway } from '../../gateways/registeredPesticideGateway';
import { IPesticideInformation } from '../../entities/chemical';

const createRegisteredPesticideFromFile = async (req: Request, res: Response) => {
    const registeredPesticideGateway = new RegisteredPesticideGateway();
    const { pesticide }: { pesticide: IPesticideInformation } = req.body;

    try {
        await registeredPesticideGateway.addRegisteredPesticideFromFile(pesticide);
        res.status(200);
    } catch (error) {
        console.log('ERROR creating a Registered Pesticide: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error creating a Registered Pesticide: ${JSON.stringify(req.body.pesticide, null, 2)}` });
    }
};

export default createRegisteredPesticideFromFile;