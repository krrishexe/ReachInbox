# ReachInbox Assignment
 
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
# Built with
- Node.js
- Express.js
- Nodemailer
- OpenAI
- Google APIs
- Axios
- bullMQ
