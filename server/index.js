require('dotenv').config()

const express = require('express')
const port = 3001
const app = express()

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('Connected to DB!')
)
mongoose.set('useFindAndModify', false)

app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const userRoute = require('./routes/user')
const yourClassRoute = require('./routes/yourClass')
const examRoute = require('./routes/exam')
const questionRoute = require('./routes/question')
const verifyToken = require('./middlewares/verifyToken')
const verifyTeacher = require('./middlewares/verifyTeacher')
const getAllSubject = require('./middlewares/getAllSubject')

app.use('/auth', userRoute)
app.use('/class', verifyToken, yourClassRoute)
app.use('/exam', verifyToken, examRoute)
app.use('/question', verifyToken, questionRoute)
app.get('/verifyToken', verifyToken, (req, res) => res.status(200).send(req._id))
app.get('/getAllSubject', verifyToken, verifyTeacher, getAllSubject, (req, res) => res.status(200).send(req.subjects))

app.listen(port, () => console.log(`http://localhost:${port}`))