let express = require('express');
let app = express();
let bodyParser = require('body-parser');
require('dotenv').config();

// When accessing anything in the public folder, we display that file, using express.static middleware
app.use('/public', express.static(__dirname + '/public'));
// When any URL is accessed, we first parse the POST request, then pass info to log the request info and print to console
app.use(bodyParser.urlencoded({extended: false}), bodyParser.json(), (req, res, next) => {
    console.log(req.body);
    console.log(req.method + ' ' + req.path + ' - ' + req.ip);
    next();
});

// When getting the root URL, will display index.html from views
app.get("/", (req, res) => {
    // res.send('Hello Express');
    res.sendFile(__dirname + '/views/index.html');
});

// When traveling to /json, will display a JSON value depending on whether the variable MESSAGE_STYLE in the .env file is equal to 'uppercase' or not
app.get('/json', (req, res) => {
    jsonValue = {};
    if (process.env.MESSAGE_STYLE == 'uppercase') {
        jsonValue = {"message": "HELLO JSON"};
    } else {
        jsonValue = {"message": "Hello json"};
    }
    
    res.json(jsonValue);
});

// Route that displays the current time, returned as a JSON object
app.get('/now', (req, res, next) => {
    // Middleware function; Adds a time to request
    req.time = new Date().toString();
    next();
}, (req, res) => {
    // '/now' route handler; Responds with JSON object
    res.json({time: req.time});
});

// Route that displays a word, returned as a JSON object, using route parameters as input
app.get('/:word/echo', (req, res) => {
    res.json({echo: req.params.word});
});

// Route that displays a name, returned as a JSON object, using query parameters as input
app.route('/name').get((req, res) => {
    // Get request
    res.json({'name': req.query.first + ' ' + req.query.last});
}).post((req, res) => {
    // Post request
    res.json({'name': req.body.first + ' ' + req.body.last});
})

 module.exports = app;
