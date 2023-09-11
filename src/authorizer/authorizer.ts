import { CognitoGateway } from "../gateways/cognitoGateway";

export enum AllowedPaths {
    AUTH = '/auth'
};

export const allowedPaths = Object.values(AllowedPaths);

const cognitoGateway = new CognitoGateway();

exports.handler = async (event: any) => {
    console.log('Authorizer Event:', event)

    // const isPathWhiteListed = allowedPaths.findIndex(path => event.requestContext.http.path.includes(path)) > -1;

    // console.log('isPathWhiteListed: ', isPathWhiteListed)
    // if (isPathWhiteListed) {
    //     return generatePolicy({ allow: true });
    // }

    // const token = event.headers &&
    //     (event.headers['X-Amz-Security-Token'] || event.headers['x-amz-security-token']) ||
    //     event.authorizationToken;
    // if (!token) {
    //     console.log('Authorizer - No Token ID')
    //     return generatePolicy({ allow: false })
    // }

    // const isUserLoggedIn = await cognitoGateway.isUserAuthenticated(token);
    // if (!isUserLoggedIn) {
    //     console.log('Authorizer - User not logged in')
    //     return generatePolicy({ allow: false })
    // }
    // console.log('TokenId: ', token)
    return generatePolicy({ allow: true });
}

function generatePolicy({ allow }: { allow: boolean }) {
    return {
        principalId: 'token',
        policyDocument: {
            Version: '2012-10-17',
            Statement: {
                Action: 'execute-api:Invoke',
                Effect: allow ? 'Allow' : 'Deny',
                Resource: '*'
            }
        }
    }
}