export interface IStripeGateway {
    createPaymentIntent(): Promise<any>
}

export class StripeGateway implements IStripeGateway {

    private stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2022-08-01",
    });

    async createPaymentIntent(): Promise<any> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: 10000,
                currency: 'usd',
                metadata: { integration_check: 'accept_a_payment' },
            });
            return paymentIntent;
        } catch (error) {
            console.log(`StripeGateway - Error occured in creating payment intent: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in creating payment intent: ${JSON.stringify(error, null, 2)}`);
        }
    }
}