const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const upload = require('express-fileupload')
const db = require('./config/db')
const userRouter = require('./routes/user')
const pdfDataRouter = require('./routes/PdfData')
dotenv.config()
const port = process.env.PORT || 5000
const path = require('path')

db()
app.use(cors())
app.use(express.json())
app.use(upload())

// route to render build react https://pdf-gen-production-7c75.up.railway.app
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.use(express.static(path.join(__dirname, "build")))

app.use(express.static(__dirname + 'assets'));
app.use('/pdf', express.static(__dirname + '/uploads'));

app.use('/user', userRouter)
app.use('/pdf', pdfDataRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))