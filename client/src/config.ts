// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'y4a8aocxyj'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-ra6uf2f1.us.auth0.com',            // Auth0 domain
  clientId: 'YJ82IH1EeUe3xovv09ryt4ayXvHV4amW',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
