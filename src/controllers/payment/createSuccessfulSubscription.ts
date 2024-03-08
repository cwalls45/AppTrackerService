import { Request, Response } from 'express';
import { StripeGateway } from '../../gateways/stripeGateway';

const createSuccessfulSubscription = async (req: Request, res: Response) => {
    const stripeGateway = new StripeGateway();
    try {
        const sessionId = req.body.sessionId as string;
        const session = await stripeGateway.fetchCheckoutSession(sessionId);
        console.log('Session: ', JSON.stringify(session, null, 2));
    } catch (error) {
        console.log('ERROR creating a successful subscription: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error creating a successful subscription.` });
    }
}

export default createSuccessfulSubscription;