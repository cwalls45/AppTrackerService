import Stripe from 'stripe';
import { ANNUAL_SUBSCRIPTION_PRICE_ID, STRIPE_SECRET_KEY } from '../environment/stripeApiKeys';
import { IAccount } from '../entities/account';
import { subscriptionSucessfullUrl } from '../environment/path';

export interface IStripeGateway {
    createCheckoutSession(): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    createCustomer(account: IAccount): Promise<void>;
}

export class StripeGateway implements IStripeGateway {

    private stripe: Stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
        typescript: true
    });

    async createCustomer(account: IAccount): Promise<void> {

        try {
            const { user, courseInfo } = account;
            await this.stripe.customers.create({
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                address: {
                    city: courseInfo.city,
                    country: 'US',
                    line1: courseInfo.address1,
                    line2: courseInfo.address2 ? courseInfo.address2 : undefined,
                    postal_code: courseInfo.zipCode,
                    state: courseInfo.state,
                }
            });
        } catch (error) {
            console.log(`StripeGateway - Error occurred in creating customer: ${error}`);
            throw new Error(`Error occurred in creating customer: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async createCheckoutSession() {

        try {

            const session = await this.stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: ANNUAL_SUBSCRIPTION_PRICE_ID,
                        quantity: 1,
                    },
                ],
                ui_mode: 'embedded',
                return_url: subscriptionSucessfullUrl,
            });

            return session;
        } catch (error) {
            console.log(`StripeGateway - Error occurred while creating a checkout session: ${error}`)
            throw new Error(`Error occurred while creating a checkout session: ${JSON.stringify(error, null, 2)}`);
        }
    }
}