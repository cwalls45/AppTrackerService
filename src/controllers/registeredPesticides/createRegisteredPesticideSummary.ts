import { Request, Response } from 'express';
import { RegisteredPesticideGateway } from '../../gateways/registeredPesticideGateway';
import { IPesticideInformation } from '../../entities/chemical';

const createRegisteredPesticideSummary = async (req: Request, res: Response) => {
    const registeredPesticideGateway = new RegisteredPesticideGateway();
    const { pesticide }: { pesticide: IPesticideInformation } = req.body;

    try {
        await registeredPesticideGateway.createRegisteredPesticideSummary(pesticide);
        res.status(200);
    } catch (error) {
        console.log('ERROR creating registered pesticide summary in controller: ', error);
        res.status(400).send({ error: `There was an error creating registered pesticide summary record: ${JSON.stringify(req.body.pesticide, null, 2)}}` });
    }
};

export default createRegisteredPesticideSummary;