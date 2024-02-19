const express = require('express');
const router = express.Router();
const { getUser, sendMail, getDrafts, readMail, getMails,parseMail } = require('../controllers/msgController')

// MessageRoutes
router.get('/user/:email', getUser)
router.get('/send', sendMail)
router.get('/drafts/:email', getDrafts)
router.get('/read/:email/message/:message', readMail)
router.get('/list/:email', getMails)

//AutomatedRoutes
router.get('/readdata/:id',parseMail)

module.exports = { router }

export { }