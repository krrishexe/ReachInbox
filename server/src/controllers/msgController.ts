import axios from 'axios';
const { createConfig } = require('../helpers/utils')
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const constants = require('../constants')
require('dotenv').config()


const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI!,
})
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN! })

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
        // console.log(constants.mailOptions)
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
        console.log(req.params)
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages/${req.params.message}`
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token)
        const response = await axios(config)
        let data = await response.data
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

module.exports = { getUser, sendMail, getDrafts, readMail, getMails }

export { }