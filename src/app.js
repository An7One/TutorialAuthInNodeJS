import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

const app = express()
const PORT = 3008

const MongoStore = connectMongo(session)

// to connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testForAuth',
    {
        useNewUrlParser: true,
        useCreateIndex: true
    })
var db = mongoose.connection

// to handle mongo error
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log("MongoDB has been connected")
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

// to use sessions to track login
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}))

// To parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// to serve static files from template
app.use(express.static(__dirname + '/templateLogReg'))

// to include routes
var routes = require('./routes/router')
app.use('/', routes)

// to catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('File Not Found')
    err.status = 404
    next(err)
})

// Error Handler
// to define the last one.use callback
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message)
})

module.exports = app