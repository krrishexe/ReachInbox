const { Worker } = require('bullmq');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const constants = require('./constants')
require('dotenv').config()
import OpenAI from 'openai';

const oAuth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
})
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN! })

const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRECT_KEY! });

let hardCodedReply = false;
const sendMail = async (data: any) => {
  try {
    // console.log("data : ", data)
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
      from: data.from,
      to: data.to,
      subject: 'Hello from gmail API using NodeJS',
      text: 'Hello from gmail email using API',
      html: '<h1>Hello from gmail email using API</h1>'
    }

    let response: any;
    if (!hardCodedReply) {
      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0301",
        max_tokens: 60,
        temperature: 0.5,
        messages: [{
          role: "user", content: `If the email mentions they are interested to know more, your reply should ask them if they are willing to hop on to a demo call by suggesting a time.
                  write a small text on above request in around 50 -70 words`
        }],
      });
    }

    if (data.label === 'Interested') {
      mailOptions.subject = `User is : ${data.label}`
      mailOptions.text = hardCodedReply ? `Thank you for your email expressing interest in knowing more about our product/service. However, it is not clear from your previous mail whether you are interested or not. Could you please provide us with some more information? This will help us understand your requirements better and provide you with relevant information.` : `${response.choices[0].message.content}`;
      mailOptions.html = `<p>${mailOptions.text}</p><img src="" alt="reachinbox">`;
    } else if (data.label === 'Not Interested') {
      mailOptions.subject = `User is : ${data.label}`
      mailOptions.text = hardCodedReply ? `Thank you for considering our offering. We respect your decision. Could you kindly share feedback on why our product/service did not align with your needs? Your insights are invaluable as we strive to improve our offerings. Looking forward to hearing from you.` : `${response.choices[0].message.content}`;
      mailOptions.html = `<p>${mailOptions.text}</p><img src="" alt="reachinbox">`;
    } else if (data.label === 'More information') {
      mailOptions.subject = `User wants : ${data.label}`
      mailOptions.text = hardCodedReply ? `Thank you for your interest in our product/service! We appreciate your enthusiasm. Could you please provide more details on your level of interest? Your previous email was positive, and we want to ensure we tailor our response accordingly. Any additional insights you can share would be greatly helpful. Looking forward to hearing more from you!` : `${response.choices[0].message.content}`;
      mailOptions.html = `<p>${mailOptions.text}</p><img src="" alt="reachinbox">`;
    }

    const result = await transport.sendMail(mailOptions)
    return result

  } catch (error: any) {
    console.log("Cant send email ", error.message)
  }
}



const parseAndSendMail = async (data1: any) => {
  try {
    // console.log("entered parseAndSendMail")
    // console.log("body is :", data1)
    const { from, to } = data1;
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: data1.id,
      format: 'full', // get the full email
    });
    // console.log("message",message)

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
    let emailContext = `${subject} ${snippet} ${textContent} `;
    let emailContextUpdated = emailContext.slice(0, 4000)
    // console.log("emailContextUpdated", emailContextUpdated)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0301",
      max_tokens: 60,
      temperature: 0.5,
      messages: [{
        role: "user", content: `based on the following text  just give one word answer, Categorizing the text based on the content and assign a label from the given options -
          Interested,
          Not Interested,
          More information. text is : ${emailContextUpdated}`
      }],

    });

    // console.log(response.choices[0]);

    // Map the model output to one of the labels
    const prediction: any = response.choices[0]?.message.content!;
    // console.log("response.choices[0].message.content", response.choices[0].message.content)
    // console.log("prediction", prediction)
    let label;
    if (prediction.includes("uninterested")) {
      label = 'Not Interested';
    }
    else if (prediction.includes("info")) {
      label = 'More information';
    }
    else {
      label = 'Interested';
    }

    // switch (prediction) {
    //   case 'Interested':
    //     label = 'Interested';
    //     break;
    //   case 'Not Interested':
    //     label = 'Not Interested';
    //     break;
    //   case 'More information.':
    //     label = 'More information';
    //     break;
    //   default:
    //     label = 'Not Sure';
    // }

    const data = { subject, textContent, snippet: message.data.snippet, label, from, to }
    console.log(data)
    const dataFromMail = await sendMail(data);
    return dataFromMail
    // res.send({ subject, textContent, snippet: message.data.snippet, label });
  } catch (error: any) {
    console.log("Can't fetch email ", error.message);
    return -1
  }
}

const sendEmail = (data: any,jobID:any) => new Promise(async (req, res) => {
  let helo = await parseAndSendMail(data)
  if(helo){
    console.log(`Job completed and sent to ${data.to}`);
  }
  
  // console.log(helo)
  return helo

}).then(res => console.log(res)).catch(err => console.log(err));

const mailWorker = new Worker('email-queue', async (job: any) => {
  const { from, to, id ,jobId} = job.data;
  console.log(`Job ${job.id} has started`)
  const result = setTimeout(async () => {
    await sendEmail(job.data,job.id)
  }, 5000);
  console.log("Job in progress")
}, {
  connection: {
    host: "localhost",
    port: 6379,
  },
});


// export {}