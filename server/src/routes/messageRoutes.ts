const express = require('express');
const router = express.Router();
const { getUser, sendMail, getDrafts, readMail, getMails } = require('../controllers/msgController')

router.get('/user/:email', getUser)
router.get('/send', sendMail)
router.get('/drafts/:email', getDrafts)
router.get('/read/:email/message/:message', readMail)
router.get('/list/:email', getMails)

module.exports = { router }

export { }