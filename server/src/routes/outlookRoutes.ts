const express = require('express');
const app = express();
const outlookRouter = express.Router();
const {
    handleAuthorization,
    getMailsFromOutlook,
    signInOutlook,
    getAccessTokenFromOutlook
} = require('../controllers/outlookController')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//outlookRoutes
// outlookRouter.get('/user/:email', getUserFromOutlook)
// outlookRouter.get('/send', sendMailFromOutlook)
// outlookRouter.get('/drafts/:email', getDraftsFromOutlook)
// outlookRouter.get('/read/:email/message/:message', readMailFromOutlook)
outlookRouter.get('/signin', signInOutlook)
outlookRouter.get('/', handleAuthorization)
outlookRouter.get('/get-access-token', getAccessTokenFromOutlook)
outlookRouter.get('/get-mails/:num', getMailsFromOutlook)

module.exports = {outlookRouter}

export { }   