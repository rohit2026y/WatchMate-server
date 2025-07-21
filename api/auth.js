// /api/auth.js
// This is a Vercel Serverless Function to securely provide Ably authentication tokens.

const Ably = require('ably');

// IMPORTANT: You will store your Ably API Key in your Vercel project's
// Environment Variables settings. It should be named ABLY_API_KEY.
const ABLY_API_KEY = process.env.ABLY_API_KEY;

// The main handler for the serverless function
module.exports = (req, res) => {
    // Set CORS headers to allow requests from YouTube's domain
    res.setHeader('Access-Control-Allow-Origin', 'https://www.youtube.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Vercel needs to handle pre-flight CORS requests for browsers
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log("Received auth request...");

    if (!ABLY_API_KEY) {
        console.error("Server configuration error: ABLY_API_KEY environment variable is not set.");
        return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const ably = new Ably.Rest({ key: ABLY_API_KEY });

    const tokenParams = {
        // You can add a unique clientID for each user here in the future
        // clientId: 'user-' + Math.random().toString(36).substr(2, 9),
        capability: { '*': ['subscribe', 'publish'] },
    };

    // Create and send the token to the client.
    ably.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
        if (err) {
            console.error("Error creating token request:", err);
            return res.status(500).json({ error: 'Error creating Ably token request' });
        }
        console.log("Successfully created token request. Sending to client.");
        res.status(200).json(tokenRequest);
    });
};
