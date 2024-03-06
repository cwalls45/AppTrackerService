import { Request, Response } from 'express';
import { StripeGateway } from '../../gateways/stripeGateway';

const createCheckoutSessionClientSecret = async (req: Request, res: Response) => {
  const stripeGateway = new StripeGateway();

  try {
    const checkoutSessionResponse = await stripeGateway.createCheckoutSession();

    if (!checkoutSessionResponse) {
      throw new Error('Stripe Gateway method did not successfully resolve.')
    }

    res.send({ clientSecret: checkoutSessionResponse.client_secret });
  } catch (error) {
    console.log('There was an error in controller while creating the checkout session: ', error);
    res.status(400).send({ error: `There was an error while creating the checkout session: ${JSON.stringify(error, null, 2)}` });
  }
}

export default createCheckoutSessionClientSecret;