import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../environment/path';

export interface IStripeGateway {
    createPaymentIntent(): Promise<any>
}

export class StripeGateway implements IStripeGateway {

    private stripe: Stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
        typescript: true
    });

    async createPaymentIntent(): Promise<any> {
        const price = 100;

        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: price * 100,
                currency: 'USD'
            });

            return paymentIntent.client_secret;
        } catch (error) {
            console.log(`StripeGateway - Error occured in creating payment intent: ${error}`)
            throw new Error(`Error occured in creating payment intent: ${JSON.stringify(error, null, 2)}`);
        }
    }
}