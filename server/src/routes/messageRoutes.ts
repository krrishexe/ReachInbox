const express = require('express');
const router = express.Router();
const { getUser, sendMail, getDrafts, readMail, getMails } = require('../controllers/msgController')

router.get('/user/:email', getUser)
// router.post('/send', sendMail)
// router.post('/drafts/:email', getDrafts)
// router.post('/read', readMail)
// router.post('/list/:email', getMails)

module.exports = { router }

export { }