enum AllowedPaths {
    AUTH = '/auth'
};

const allowedPaths = Object.values(AllowedPaths);

exports.handler = async (event: any) => {
    console.log('event:', event)

    const isPathWhiteListed = allowedPaths.findIndex(path => event.requestContext.http.path.includes(path)) > -1;

    console.log('isPathWhiteListed: ', isPathWhiteListed)
    if (isPathWhiteListed) {
        return generatePolicy({ allow: true });
    }

    const token = event.headers &&
        (event.headers['X-Amz-Security-Token'] || event.headers['x-amz-security-token']) ||
        event.authorizationToken;

    if (!token) {
        console.log('No Token ID')
        return generatePolicy({ allow: false })
    }
    console.log('TokenId: ', token)
    return generatePolicy({ allow: true })
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