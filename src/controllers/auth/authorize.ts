import { NextFunction, Request, Response } from 'express';
import { CognitoGateway } from '../../gateways/cognitoGateway';
import { allowedPaths } from '../../authorizer/authorizer';

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const cognitoGateway = new CognitoGateway();
    try {

        const isPathWhiteListed = allowedPaths.findIndex(path => req.url.includes(path)) > -1;

        if (isPathWhiteListed) {
            return next();
        }

        const token = req.headers &&
            (req.headers['X-Amz-Security-Token'] || req.headers['x-amz-security-token']) as string;

        if (!token) {
            console.log('Authorizer - No Token ID')
            res.status(403).end()
        }

        const isUserLoggedIn = await cognitoGateway.isUserAuthenticated(token);
        if (!isUserLoggedIn) {
            console.log('Authorizer - User not logged in')
            res.status(403).end()
        }

        return next();

    } catch (error) {

    }
};

export default authorize;