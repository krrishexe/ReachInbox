const express = require('express');
const app = express();
const router = express.Router();
const { getUser, sendMail, getDrafts, readMail, getMails, parseAndSendMail } = require('../controllers/msgController')

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MessageRoutes
router.get('/user/:email', getUser)
router.get('/send', sendMail)
router.get('/drafts/:email', getDrafts)
router.get('/read/:email/message/:message', readMail)
router.get('/list/:email', getMails)

//AutomatedRoutes
router.post('/readdata/:id', parseAndSendMail)

export default router;

export { }