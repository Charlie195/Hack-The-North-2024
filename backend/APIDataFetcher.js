const { expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const jwtCheck = expressJwt({
  secret: jwksRsa.koaJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-dncogyhq7jblxbbn.us.auth0.com/.well-known/jwks.json`
  }),
  audience: 'Yhttps://dev-dncogyhq7jblxbbn.us.auth0.com/api/v2/',
  issuer: `https://YOUR_DOMAIN/`,
  algorithms: ['RS256']
});

app.use(jwtCheck);
