// NPM dependencies
const express = require('express')
const exphbs  = require('express-handlebars');
const dotenv = require('dotenv')

// Run before other code to make sure variables from .env are available
dotenv.config()

// Local dependencies
const spreadsheet = require('./lib/spreadsheet.js')

// Config
const app = express()
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    let sessions;
    spreadsheet.getSessions( function(results) {
        sessions = results;
        res.render('session_listing', { sessions })
    }); 
});

app.get('/sessions.json', function (req, res) {
    let sessions;
    spreadsheet.getSessions( function(results) {
        sessions = results;
        res.send(sessions);
    }); 
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});