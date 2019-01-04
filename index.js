// NPM dependencies
const express = require('express')
const app = express()
const dotenv = require('dotenv')

// Run before other code to make sure variables from .env are available
dotenv.config()

// Local dependencies
const spreadsheet = require('./lib/spreadsheet.js')

app.all('/', function (req, res) {
    let sessions;
    spreadsheet.getSessions( function(results) {
        sessions = results;
        res.send(sessions);
    }); 
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});