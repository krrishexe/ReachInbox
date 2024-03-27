import axios from "axios";
const { Client } = require("@microsoft/microsoft-graph-client");
const { PublicClientApplication, ConfidentialClientApplication } = require("@azure/msal-node");

import dotenv from "dotenv";

dotenv.config();

const clientId: any = process.env.AZURE_CLIENT_ID!; // Your Azure app's client ID
const clientSecret: any = process.env.AZURE_CLIENT_SECRET!; // Your Azure app's client secret
const tenantId: any = process.env.AZURE_TENANT_ID!; // Your Azure app's tenant ID
const redirectUri: any = "http://localhost:5000";
const scopes = ["https://graph.microsoft.com/.default"];

const msalConfig = {
    auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri,
    },
};

const pca = new PublicClientApplication(msalConfig);

const ccaConfig = {
    auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        clientSecret,
    },
};

const cca = new ConfidentialClientApplication(ccaConfig);


export const signInOutlook = async (req: any, res: any) => {
    try {
        const authCodeUrlParameters = {
            scopes,
            redirectUri,
        };

        pca.getAuthCodeUrl(authCodeUrlParameters).then((response: any) => {
            res.redirect(response);
        });
    } catch (error: any) {
        console.log("Error signing in:", error);
    }
}


export const handleAuthorization = async (req: any, res: any) => {
    try {
        const tokenRequest = {
            code: req.query.code,
            scopes,
            redirectUri,
            clientSecret: clientSecret,
        };

        pca.acquireTokenByCode(tokenRequest).then((response: any) => {
            // Store the user-specific access token in the session for future use
            req.session.accessToken = response.accessToken;

            // Redirect the user to a profile page or any other secure route
            // This time, we are redirecting to the get-access-token route to generate a client token
            res.redirect("/get-access-token");
        }).catch((error: any) => {
            console.log(error);
            res.status(500).send(error);
        });

    } catch (error: any) {
        console.log("Error handling authorization:", error)
    }
}

export const getAccessTokenFromOutlook = async (req: any, res: any) => {
    try {
        const tokenRequest = {
            scopes,
            clientSecret: clientSecret,
        };

        const response = await cca.acquireTokenByClientCredential(tokenRequest);
        const accessToken = response.accessToken;

        // Store the client-specific access token in the session for future use
        req.session.clientAccessToken = accessToken; // This will now be stored in the session

        res.send("Access token acquired successfully!");
    } catch (error: any) {
        console.error('Error retrieving access token:', error);
        res.status(500).json({ error: 'Failed to retrieve access token' });

    }
}

export const getMailsFromOutlook = async (req: any, res: any) => {
    const num = req.params.num;

    try {
        const userAccessToken = req.session.accessToken;
        const clientAccessToken = req.session.clientAccessToken;

        // Check if the user and client are authenticated
        if (!userAccessToken) {
            return res.status(401).send("User not authenticated. Please sign in first.");
        }

        if (!clientAccessToken) {
            return res.status(401).send("Client not authenticated. Please acquire the client access token first.");
        }

        // Initialize the Microsoft Graph API client using the user access token
        const client = Client.init({
            authProvider: (done: any) => {
                done(null, userAccessToken);
            },
        });

        // Fetch the user's emails using the Microsoft Graph API
        const messages = await client.api("/me/messages").top(num).get();
        res.send(messages);
    } catch (error: any) {
        res.status(500).send(error);
        console.log("Error fetching messages:", error.message);
    }
}





export const getUserFromOutlook = async (req: any, res: any) => {

}

module.exports = {
    signInOutlook,
    handleAuthorization,
    getAccessTokenFromOutlook,
    getMailsFromOutlook,
    getUserFromOutlook
}