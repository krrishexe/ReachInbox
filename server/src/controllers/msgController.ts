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
        // const accessToken = await oAuth2Client.getAccessToken();
        // const transport = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         type: 'OAuth2',
        //         user: process.env.GOOGLE_USER,
        //         clientId: process.env.GOOGLE_CLIENT_ID,
        //         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        //         accessToken: accessToken,
        //     }
        // })


    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

const getDrafts = async (req: any, res: any) => {
    try {
        res.send("Hello mail sent")
    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

const readMail = async (req: any, res: any) => {
    try {
        res.send("Hello mail sent")
    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

const getMails = async (req: any, res: any) => {
    try {
        res.send("Hello mail sent")
    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

module.exports = { getUser, sendMail, getDrafts, readMail, getMails }

export { }