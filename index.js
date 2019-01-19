// Concurrency
const throng = require('throng');
const WORKERS = process.env.WEB_CONCURRENCY || 1;
const port = process.env.PORT || 3000;

throng({
    workers: WORKERS,
    lifetime: Infinity
}, start)

function start() {
    // NPM dependencies
    const helmet = require('helmet');
    const express = require('express')
    const exphbs  = require('express-handlebars')
    const handlebars = require('handlebars')
    const groupBy = require('handlebars-group-by')
    const dotenv = require('dotenv')

    // Run before other code to make sure variables from .env are available
    dotenv.config()

    // Local dependencies
    const spreadsheet = require('./lib/spreadsheet.js')
    const cache = require('./lib/cache.js');
    
    // Config
    const app = express();
    app.use(helmet({ 
        dnsPrefetchControl: { allow: true }
    }));
    app.use(express.static('assets'))
    groupBy.register(handlebars);
    const hbs = exphbs.create({
        handlebars: handlebars, 
        defaultLayout: 'main',
        helpers: require('handlebars-helpers')() 
    })
    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars')

    // Default .env variables
    var cacheTimeout = process.env.CACHE_TIMEOUT;
    if (!cacheTimeout) {
        cacheTimeout = '5';
    }
    var unconfName = process.env.UNCONF_NAME;
    if (!unconfName) {
        unconfName = 'Unconference name';
    }
    var logoUrl = process.env.LOGO_URL;
    // Default title
    var metaTitle = 'Sessions for ' + unconfName;

    // Routes
    app.get('/', function (req, res) {
        spreadsheet.getCachedSessions( function(sessions, error) {
            metaTitle = 'Sessions for ' + unconfName;
            res.render('session_listing', { sessions, error, unconfName, logoUrl, metaTitle })
        }); 
    });

    app.get('/partials/sessions', function (req, res) {
        spreadsheet.getCachedSessions( function(sessions, error) {
            res.render('session_listing', { sessions, error, unconfName, logoUrl, metaTitle, layout: false })
        }); 
    });

    app.get('/sessions/:sessionID', function (req, res) {
        spreadsheet.getCachedSession(req.params.sessionID, function(session, error) {
            if(session == null) {
                res.status(404).send("That session can't be found. Head back to the <a href='/'>listing page</a> and try again.");
                return;
            }
            metaTitle = session.title + ' at ' + unconfName;
            res.render('full_session', { session, error, unconfName, metaTitle, logoUrl })
        }); 
    });
    
    app.get('/sessions.json', cache(cacheTimeout), function (req, res, error) {
        spreadsheet.getSessions( function(sessions, error) {
            res.send(sessions);
        }); 
    });

    // Warm the cache and then wait for requests
    spreadsheet.initCachedSessions(function() {
        app.listen(port, (err) => {
            console.log('Listening on', port);
            if (err) {
                throw err;
            }
        });
    });

}