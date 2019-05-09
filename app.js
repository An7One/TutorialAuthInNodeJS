var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

const PORT = 3008

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

// to listen to port 3008
app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`)
})