// NPM dependencies
const express = require('express')
const exphbs  = require('express-handlebars')
const handlebars = require('handlebars')
const groupBy = require('handlebars-group-by')
const dotenv = require('dotenv')

// Run before other code to make sure variables from .env are available
dotenv.config()

// Local dependencies
const spreadsheet = require('./lib/spreadsheet.js')

// Config
const port = process.env.PORT || 3000;
const app = express()
app.use(express.static('assets'))
groupBy.register(handlebars);
const hbs = exphbs.create({
    handlebars: handlebars, 
    defaultLayout: 'main'
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// Default .env variables
var unconfName = process.env.UNCONF_NAME;
if (!unconfName) {
    unconfName = 'Unconference name';
}
var logoUrl = process.env.LOGO_URL;

// Routes
app.get('/', function (req, res) {
    spreadsheet.getSessions( function(sessions, error) {
        res.render('session_listing', { sessions, error, unconfName, logoUrl })
    }); 
});

app.get('/partials/sessions', function (req, res) {
    spreadsheet.getSessions( function(sessions, error) {
        res.render('session_listing', { sessions, error, layout: false })
    }); 
});

app.get('/sessions.json', function (req, res, error) {
    spreadsheet.getSessions( function(sessions, error) {
        res.send(sessions);
    }); 
});

app.listen(port, (err) => {
	if (err) {
		throw err;
	}
});