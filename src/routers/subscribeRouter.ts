import express from "express";
import getStripePublishableKey from "../controllers/payment/getStripePublishableKey";
import createCheckoutSessionClientSecret from "../controllers/payment/createCheckoutSessionCleintSecret";

const subscribeRouter = express.Router();

subscribeRouter.get('/stripe-config', getStripePublishableKey);

subscribeRouter.get('/checkout-session', createCheckoutSessionClientSecret);

export default subscribeRouter;