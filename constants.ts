require('dotenv')

type Auth = {
    type: string,
    user: string,
    clientId: any,
    clientSecret: string,
    refreshToken: any,
}

const auth : Auth = {
    type: 'OAuth2',
    user: 'aryan.yadav.9889@gmail.com',
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
}

type MailOptions = {
    from: string,
    to: string,
    subject: string,
    text?: string,
    html?: string
}

const mailOptions:MailOptions = {
    from: 'Krish Yadav 📩 <aryan.yadav.9889@gmail.com>',
    to: 'krish.12018275@lpu.in',
    subject: 'Hello from gmail API using NodeJS',
    // text: 'Hello from gmail email using API',
    // html: '<h1>Hello from gmail email using API</h1>'
}

module.exports = { auth, mailOptions }
