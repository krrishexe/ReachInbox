const express = require('express');
const app = express();
require('dotenv').config()
const {router} = require('./routes/messageRoutes')



app.use('/api/mail',router)

app.get('/', async (req:any, res:any) => {
    return res.json({ message: 'Hello World' })
})

app.listen(5000 || process.env.PORT, () => {
    console.log("Server is running on port http://localhost:5000")
})


export {}