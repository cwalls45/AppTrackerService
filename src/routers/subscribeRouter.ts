import express from "express";
import getStripePublishableKey from "../controllers/payment/getStripePublishableKey";
import createPaymentIntent from "../controllers/payment/createPaymentIntent";

const subscribeRouter = express.Router();

subscribeRouter.get('/stripe-config', getStripePublishableKey);

subscribeRouter.get('/payment-intent', createPaymentIntent)

export default subscribeRouter;