import { Constants } from 'expo';

/*
Explanation of Release channel flow: https://docs.expo.io/versions/latest/distribution/advanced-release-channels
 */

const ENV = {
    dev: {
        dashboardUrl: 'http://192.168.178.88:3000',
        graphqlUrl: 'https://pioa-graphql-staging.herokuapp.com/v1alpha1/graphql',
        debugLevel: 0,
        auth0Domain: 'https://pioa.auth0.com',
        auth0ClientId: '50KdsS658GvDb9MBhZSyXZaaVWpdsMJO',
    },
    staging: {
        dashboardUrl: 'https://master--pioa-dashboard.netlify.com',
        graphqlUrl: 'https://pioa-graphql-staging.herokuapp.com/v1alpha1/graphql',
        debugLevel: 0,
        auth0Domain: 'https://pioa.auth0.com',
        auth0ClientId: '50KdsS658GvDb9MBhZSyXZaaVWpdsMJO',
    },
    prod: {
        dashboardUrl: 'https://app.pioa.net',
        graphqlUrl: 'https://pioa-graphql-production.herokuapp.com/v1alpha1/graphql',
        debugLevel: 0,
        auth0Domain: 'https://pioa.auth0.com',
        auth0ClientId: '50KdsS658GvDb9MBhZSyXZaaVWpdsMJO',
    },
};

function getEnvVars(env = '') {
    // if (env === null || env === undefined || env === '') return ENV.dev;
    if (env.indexOf('dev') !== -1) return ENV.dev;
    if (env.indexOf('staging') !== -1) return ENV.staging;
    if (env.indexOf('prod') !== -1) return ENV.prod;
    // Should be dev by default
    return ENV.staging;
}

export default getEnvVars(Constants.manifest.releaseChannel);
