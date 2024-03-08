import express from "express";
import getStripePublishableKey from "../controllers/payment/getStripePublishableKey";
import createCheckoutSessionClientSecret from "../controllers/payment/createCheckoutSessionCleintSecret";
import createSuccessfulSubscription from "../controllers/payment/createSuccessfulSubscription";

const subscribeRouter = express.Router();

subscribeRouter.get('/stripe-config', getStripePublishableKey);

subscribeRouter.get('/checkout-session', createCheckoutSessionClientSecret);

subscribeRouter.post('/successful-subscription', createSuccessfulSubscription);

export default subscribeRouter;