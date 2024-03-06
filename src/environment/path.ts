export const USER_POOL = process.env.USER_POOL;
export const USER_POOL_CLIENT = process.env.USER_POOL_CLIENT;
export const DYNAMO = process.env.DYNAMO;
export const UI_URL = process.env.UI_URL;
export const subscriptionSucessfullUrl = `${UI_URL}/subscribe/successful/{CHECKOUT_SESSION_ID}`;