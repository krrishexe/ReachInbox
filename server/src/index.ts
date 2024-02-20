const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config()
import router from "./routes/messageRoutes"

// app.use(express.json())
// app.use(express.urlencoded({ extended: true })) // Add closing parenthesis here
app.use(bodyParser.json());
// MessageRoutes
app.use('/api/mail', router)


app.get('/', async (req: any, res: any) => {
    return res.json({ message: 'Hello World' })
})

app.listen(5000 || process.env.PORT, () => {
    console.log("Server is running on port http://localhost:5000")
})


export { }