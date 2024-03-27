import axios from 'axios';
const { createConfig } = require('../helpers/utils')
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const constants = require('../constants')
require('dotenv').config()
import OpenAI from 'openai';
const { Queue } = require("bullmq");
import { z } from 'zod'


// zod Schema for backend validation
const initSchema = z.object({
    from: z.string(),
    to: z.string(),
    id: z.string()
})

const sendMailViaQueueSchema = z.object({
    params:z.object({
        id:z.string()
    }),
    body:z.object({
        from: z.string(),
        to: z.string(),
    })
})

//Zod Schema types for backend validtation.
type initSchemaType = z.infer<typeof initSchema>
type sendMailViaQueueSchemaType = z.infer<typeof sendMailViaQueueSchema>

const sendMailQueue = new Queue("email-queue", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});

async function init(body: initSchemaType) {
    console.log(body)
    const res = await sendMailQueue.add("Email to the selected User", {
        from: body.from,
        to: body.to,
        id: body.id,
        // subject: "This is subject",
        // body: "hiiiiii",
    }, { removeOnComplete: true });
    console.log("Job added to queue", res.id);
}



const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI!,
})
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN! })

const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRECT_KEY! });



const getUser = async (req: any, res: any) => {
    try {
        // console.log("OAuth2" , oAuth2Client)
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`
        const { token } = await oAuth2Client.getAccessToken();
        if (!token) { return res.send("Token not found , Please login again to get token") }
        // console.log("token",token)
        const config = createConfig(url, token)
        console.log(config)
        const response = await axios(config)
        console.log(response)
        res.json(response.data)
    } catch (error: any) {
        console.log("Cant get user email data ", error.message)
        res.send(error.message)
    }
}

const getDrafts = async (req: any, res: any) => {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`
        const { token } = await oAuth2Client.getAccessToken();
        if (!token) { return res.send("Token not found , Please login again to get token") }
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
        if (!token) { return res.send("Token not found , Please login again to get token") }
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
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages?maxResults=50`
        const { token } = await oAuth2Client.getAccessToken();
        if (!token) { return res.send("Token not found , Please login again to get token") }
        const config = createConfig(url, token)
        const response = await axios(config)
        res.json(response.data)

    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}

const sendMail = async (data: any) => {
    try {
        console.log("data : ", data)
        const { token } = await oAuth2Client.getAccessToken();
        if (!token) { throw new Error("Token not found , Please login again to get token"); }
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
            from: 'Krish Yadav 📩 <aryan.yadav.9889@gmail.com>',
            to: 'krish.12018275@lpu.in',
            subject: 'Hello from gmail API using NodeJS',
            text: 'Hello from gmail email using API',
            html: '<h1>Hello from gmail email using API</h1>'
        }
        mailOptions.from = data.from;
        mailOptions.to = data.to;


        if (data.label === 'Interested') {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0301",
                max_tokens: 60,
                temperature: 0.5,
                messages: [{
                    role: "user", content: `If the email mentions they are interested to know more, your reply should ask them if they are willing to hop on to a demo call by suggesting a time.
                    write a small text on above request in around 50 -70 words`
                }],

            });
            console.log(response.choices[0])
            mailOptions.subject = `User is : ${data.label}`
            mailOptions.text = `${response.choices[0].message.content}`;
            mailOptions.html = `<p>${response.choices[0].message.content}</p>
                                <img src="" alt="reachinbox">`;
            const result = await transport.sendMail(mailOptions)
            return result
        } else if (data.label === 'Not Interested') {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0301",
                max_tokens: 60,
                temperature: 0.5,
                messages: [{
                    role: "user", content: `If the email mentions they are not interested, your reply should ask them for feedback on why they are not interested.
                    write a small text on above request in around 50 -70 words`
                }],

            });
            console.log(response.choices[0])
            mailOptions.subject = `User is : ${data.label}`
            mailOptions.text = `${response.choices[0].message.content}`;
            mailOptions.html = `<p>${response.choices[0].message.content}</p>
            <img src="" alt="reachinbox">`;
            const result = await transport.sendMail(mailOptions)
            return result
        }
        else if (data.label === 'More information') {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0301",
                max_tokens: 60,
                temperature: 0.5,
                messages: [{
                    role: "user", content: `If the email mentions they are interested to know more, your reply should ask them if they can give some more information whether thery are interested or not as its not clear from their previous mail.
                    write a small text on above request in around 70-80 words`
                }],

            });
            console.log(response.choices[0])
            mailOptions.subject = `User wants : ${data.label}`
            mailOptions.text = `${response.choices[0].message.content}`;
            mailOptions.html = `<p>${response.choices[0].message.content}</p>
            <img src="" alt="reachinbox">`;
            const result = await transport.sendMail(mailOptions)
            return result
        }

    } catch (error: any) {
        console.log("Cant send email ", error.message)
    }
}


const parseAndSendMail = async (data1: any) => {
    try {
        console.log("body is :", data1)
        const { from, to } = data1;
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: data1.id,
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

        // console.log(response.choices[0]);

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
            case 'More information.':
                label = 'More information';
                break;
            default:
                label = 'Not Sure';
        }

        const data = { subject, textContent, snippet: message.data.snippet, label, from, to }
        // console.log(data)
        await sendMail(data);
        // res.send({ subject, textContent, snippet: message.data.snippet, label });
    } catch (error: any) {
        console.log("Can't fetch email ", error.message);
    }
}


const sendMailViaQueue = async (req: sendMailViaQueueSchemaType, res: any) => {
    try {
        const { id } = req.params;
        const { from, to } = req.body;
        init({ from, to, id })
        // await sendMailQueue.add("Sending email to the queue", { from, to, id });
        // // res.send('Mail processing has been queued.');

    } catch (error: any) {
        console.log("Error in sending mail via queue", error.message)
    }
    res.send("Mail processing has been queued.")
}

const sendMultipleEmails = async (req: sendMailViaQueueSchemaType, res: any) => {
    try {
        const { id } = req.params;
        const { from, to } = req.body
        for (let i = 0; i < to.length; i++) {
            await init({ from, to: to[i], id })
        }
    } catch (error: any) {
        console.log("Error in sending multiple emails", error.message)
    }

}

module.exports = { getUser, sendMail, getDrafts, readMail, getMails, parseAndSendMail, sendMailViaQueue, sendMultipleEmails }

export { }