exports.handler = async (event: any) => {
    console.log('event:', event)

    const tokenId = event.headers &&
        (event.headers['X-Amz-Security-Token'] || event.headers['x-amz-Security-token']) ||
        event.authorizationToken;

    if (!tokenId) {
        console.log('No Token ID')
        return generatePolicy({ allow: false })
    }
    console.log('TokenId: ', tokenId)
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