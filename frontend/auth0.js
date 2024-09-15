// Import necessary modules
require('dotenv').config();
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');

// Create an Express app instance
const app = express();

// Configuration for Auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: 'https://dev-dncogyhq7jblxbbn.us.auth0.com'
};

// Attach the Auth0 middleware
app.use(auth(config));

// Set up routes
// Home
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Protected profile route
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
