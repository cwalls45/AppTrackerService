import { Request, Response } from 'express';
import { StripeGateway } from '../../gateways/stripeGateway';

const createPaymentIntent = async (req: Request, res: Response) => {
  const stripeGateway = new StripeGateway();

  try{
    const paymentIntentResponse = await stripeGateway.createPaymentIntent();

    if (!paymentIntentResponse) {
      throw new Error('Gateway method did not successfully resolve.')
    }

    res.send({paymentIntent: paymentIntentResponse});
  } catch(error) {
      console.log('There was an error creating the payment intent: ', error);
      res.status(400).send({ error: `There was an error creating the payment intent: ${JSON.stringify(error, null, 2)}` });
  }
}

export default createPaymentIntent;