# ReachInbox
 
## Server
This is a server application built with Node.js and Express. It uses various packages such as `nodemailer` for sending emails, `openai` for AI functionalities, `googleapis` for Google APIs, and `axios` for HTTP requests and `bullMQ` to process queues.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites
You need to have Node.js and npm installed on your machine. You can download Node.js from [here](https://nodejs.org/en/download/) and npm is included in the installation.

## Installing
1. Clone the repository to your local machine
```bash
git clone https://github.com/krrishexe/ReachInbox-Assignment
```
2. Navigate to the root directory of the project directory :
```bash 
cd server
```
3. Run `npm install` to install all the dependencies
4. Create a `.env` file in the root directory with same IDs as in `.env.example` file and fill in the required details.

## Running the server
1. To start the server, run the following command in your terminal
```bash
npm start
```
*This will start the server at localhost:5000 (or whatever port you have specified).*

2. To start the worker.ts file, run the following command in your terminal
```bash
nodemon src/worker.ts
```

3. To start the redis server, run the following command in your terminal
```bash
docker run -itd -p 6379:6379 redis
```
# Built with
- Node.js
- Express.js
- Nodemailer
- OpenAI
- Google APIs
- Axios
- bullMQ
- Zod (for validation)

## API Endpoints

For Google's OAuth2.0:

- `/api/mail/user/:email` - GET request to send an email
- `/api/mail/drafts/:email` - GET request to view drafts mail.
- `/api/mail/drafts/:email` - GET request to view drafts mail.
- `api/mail/read/:email/message/:message` - GET request to read a specific email(using id).
- `api/mail/list/:email` - GET request to get a list of top 10 mails.
- `api/mail/list/:email` - GET request to get a list of top 10 mails.
- `api/mail/readdata/:id` - POST request to send a single mail for particular ID. 
*format* : 
```json
{
    "from":"sendersmail@gmail.com",
    "to":"recieversmail@gmail.com"
}
```
- `api/mail/sendmulti/:id` - POST request to send multiple mails to multiple users simulataneously for particular ID.
*format* : 
```json
{
    "from":"sendersmail@gmail.com",
    "to":["recieversmail1@gmail.com","recieversmail2@gmail.com","recieversmail3@gmail.com" ...]
}
```
