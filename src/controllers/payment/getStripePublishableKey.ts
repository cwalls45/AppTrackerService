import { Request, Response } from 'express';
import { STRIPE_PUBLISHABLE_KEY } from '../../environment/path';

const getStripePublishableKey = async (req: Request, res: Response) => {
    try {
        res.send({ publishableKey: STRIPE_PUBLISHABLE_KEY });
    } catch (error) {
        console.log('ERROR getting Stripe publishable key: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error getting the Stripe publishable key` });
    }
}

export default getStripePublishableKey;