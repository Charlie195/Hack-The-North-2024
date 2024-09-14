// Import necessary modules
const express = require('express');
const { auth } = require('express-openid-connect');

// Create an Express app instance
const app = express();

// Configuration for Auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env', // Make sure to store this in your environment variables
  baseURL: 'http://localhost:3000',
  clientID: 'V7S8A0qcDGuJqjig4He3sk8T0uDJIEQ4',
  issuerBaseURL: 'https://dev-dncogyhq7jblxbbn.us.auth0.com'
};

// Attach the Auth0 middleware
app.use(auth(config));

// Set up routes
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
