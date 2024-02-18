import express from "express";
import getStripePublishableKey from "../controllers/payment/getStripePublishableKey";
import createPaymentIntent from "../controllers/payment/createPaymentIntent";

const authRouter = express.Router();

authRouter.get('/stripe-config', getStripePublishableKey);

authRouter.post('payment-intent', createPaymentIntent)

export default authRouter;