import axios from 'axios';
const { createConfig } = require('../helpers/utils')
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const constants = require('../constants')
require('dotenv').config()
import OpenAI from 'openai';

const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI!,
})
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN! })

const openai = new OpenAI({ apiKey: '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' });



const getUser = async (req: any, res: any) => {
    try {
        // console.log("OAuth2" , oAuth2Client)
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`
        const { token } = await oAuth2Client.getAccessToken();
        // console.log("token",token)
        const config = createConfig(url, token)
        console.log(config)
        const response = await axios(config)
        console.log(response)
        res.json(response.data)
    } catch (error: any) {
        console.log("Cant send email ", error.message)
        res.send(error.message)
    }
}

const sendMail = async (req: any, res: any) => {
    try {
        const { token } = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                ...constants.auth,
                accessToken: token,
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailOptions = {
            ...constants.mailOptions,
            //to: req.body.to ? req.body.to : "krish.12018275@lpu.in",    // Enter the email address of the recipient
            //text: req.body.text ? req.body.text : "This is a test mail.",

        };
        const result = await transport.sendMail(mailOptions)
        res.send(result)

    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

const getDrafts = async (req: any, res: any) => {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token)
        const response = await axios(config)
        res.json(response.data)
    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

const readMail = async (req: any, res: any) => {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages/${req.params.message}`
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token)
        const response = await axios(config)
        let data = await response.data
        console.log(data)
        res.json(data)
    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

const getMails = async (req: any, res: any) => {
    try {
        //get mails
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=50`
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token)
        const response = await axios(config)
        res.json(response.data)

    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

const parseMail = async (req: any, res: any) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: req.params.id,
            format: 'full', // get the full email
        });

        const payload = message.data.payload!;
        const headers = payload.headers!;
        const subject = headers.find((header: any) => header.name === 'Subject')?.value;

        let textContent = '';
        if (payload.parts) {
            const textPart = payload.parts.find((part: any) => part.mimeType === 'text/plain');
            if (textPart) {
                // Decode the email body
                textContent = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
            }
        } else {
            textContent = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        }
        let snippet = message.data.snippet;
        const emailContext = `${subject} ${snippet} ${textContent} `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0301",
            max_tokens: 60,
            temperature: 0.5,
            messages: [{
                role: "user", content: `based on the following text  just give one word answer, Categorizing the text based on the content and assign a label from the given options -
            Interested,
            Not Interested,
            More information. text is : ${emailContext}`
            }],

        });

        console.log(response.choices[0]);

        // Map the model output to one of the labels
        const prediction: any = response.choices[0]?.message.content!;
        console.log("response.choices[0].message.content", response.choices[0].message.content)
        console.log("prediction", prediction)
        let label;
        switch (prediction) {
            case 'Interested':
                label = 'Interested';
                break;
            case 'Not Interested':
                label = 'Not Interested';
                break;
            case 'More information':
                label = 'More information';
                break;
            default:
                label = 'Not Sure';
        }

        const data = { subject, textContent, snippet: message.data.snippet, label }
        console.log(data)

        res.send({ subject, textContent, snippet: message.data.snippet, label });
    } catch (error: any) {
        console.log("Can't fetch email ", error.message);
        res.send(error.message);
    }
}

module.exports = { getUser, sendMail, getDrafts, readMail, getMails, parseMail }

export { }