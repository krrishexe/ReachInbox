const express = require('express');
const session = require("express-session");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config()
import router from "./routes/messageRoutes"
const { outlookRouter } = require('./routes/outlookRoutes')


app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "any_secret_key",
  resave: false,
  saveUninitialized: false,
}));

// MessageRoutes
app.use('/api/mail', router)
app.use('/', outlookRouter)



app.get('/', async (req: any, res: any) => {
    return res.json({ message: 'Hello World' })
})

app.listen(5000 || process.env.PORT, () => {
    console.log("Server is running on port http://localhost:5000")
})


export { }