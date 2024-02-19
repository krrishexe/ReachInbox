const express = require('express');
const app = express();
require('dotenv').config()
const { createConfig } = require('./helpers/utils')
const {router} = require('./routes/messageRoutes')


const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// const CLIENT_ID = '695957091548-10lcurv29e1viovm41m7tkctcfeq0a08.apps.googleusercontent.com'
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
// const REFRESH_TOKEN = '1//04MikI16ftRGrCgYIARAAGAQSNwF-L9IrccGkBefflr6naJ2ekitGULHHKfczj767qFQ2BpDrUiukHGEASaPb8ZErEhyrJZKUKhc';





// async function sendMail() {
//     try {
//         const accessToken = await oAuth2Client.getAccessToken();
//         const transport = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: 'aryan.yadav.9889@gmail.com',
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken: accessToken,
//             }
//         })

//         const mailOptions = {
//             from: 'Krish Yadav 📩 <aryan.yadav.9889@gmail.com>',
//             to: 'krish.12018275@lpu.in', // Enter the email address of the recipient
//             subject: 'Hello from gmail using API',
//             text: 'Hello from gmail email using API',
//             html: '<h1>Hello from gmail email using API</h1>'
//         }
//         const result = await transport.sendMail(mailOptions)
//         return result

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// sendMail().then(result => console.log('Email sent...', result)).catch(error => console.log(error.message))

app.use('/api/mail',router)

app.get('/', async (req:any, res:any) => {
    return res.json({ message: 'Hello World' })
})

app.listen(5000 || process.env.PORT, () => {
    console.log("Server is running on port http://localhost:5000")
})


export {}