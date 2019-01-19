require('dotenv').config()
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var mcache = require('memory-cache');

var doc;
var sheet;
var sessions;

var cacheTimeout = process.env.CACHE_TIMEOUT;
if (!cacheTimeout) {
    cacheTimeout = '5';
}

var getYear = function() {
    return (process.env.UKGC_YEAR) ? process.env.UKGC_YEAR : (new Date()).getFullYear();
 }

 var getSpreadsheetKey = function() {
    return process.env.UKGC_SPREADSHEET_URL.match(/[-\w]{25,}/);
 }

exports.getCachedSessions = function(callback) {
  var cachedSessions = mcache.get('cachedSessions')
  var cachedError = mcache.get('cachedError')
  if (cachedSessions) {
    callback(cachedSessions, cachedError);
  } else {
    callback(null, cachedError);
  }
}

exports.getCachedSession = function(sessionId, callback) {
  var cachedSessions = mcache.get('cachedSessions')
  var cachedError = mcache.get('cachedError')
  if (cachedSessions) {
    sessions = cachedSessions.filter(function (row) {
      return row.id === sessionId;
    });
    console.log('Got '+sessions.length+' sessions of ID ' + sessionId);
    session = sessions[0];
    callback(session, cachedError);
  } else {
    callback(null, cachedError);
  }
}

exports.initCachedSessions = function(callback) {
  setCache(function() {
    setInterval(setCache, cacheTimeout * 1000);
    callback();
  });
}

var setCache = function(callback) {
  exports.getSessions(function(sessions, error) {
    if(sessions) {
      mcache.put('cachedSessions', sessions);
    }
    mcache.put('cachedError', error);
    if(typeof callback === "function") {
      callback();
    }
  })
}

exports.getSessions = function(callback) {
  async.series([
      function essentialConfig(step) {
        checkEssentialConfig(process.env, function(error) {
          if(error) {
            console.log(error)
            callback(null, error);
            return;
          }
          else {
            step();
          }
        })
      },
      function setAuth(step) {
        doc = new GoogleSpreadsheet(getSpreadsheetKey());
        var creds = {
          client_email: process.env.UKGC_CLIENT_EMAIL,
          private_key: process.env.UKGC_PRIVATE_KEY.replace(/\\n/g, '\n')
        }
  
        doc.useServiceAccountAuth(creds, step);
      },
      function getInfoAndWorksheets(step) {
        var gSheetInfo = mcache.get('gSheetInfo');
        if(gSheetInfo) {
          sheet = gSheetInfo.worksheets[0];
          step();
          return;
        } else {
          var hrstart = process.hrtime(hrstart);
          doc.getInfo(function(err, info) {
            var hrend = process.hrtime(hrstart);
            if( typeof info !== "undefined" ) {
              console.log('GSheets API response INFO in ' + hrend[0] + 's ' + hrend[1] / 1000000 + 'ms');
              // Cache the sheet info for 30 minutes
              mcache.put('gSheetInfo', info, 30 * 60 * 1000);
              sheet = info.worksheets[0];
            }
            step();
          });
        }
      },
      function workingWithRows(step) {
        var hrstart = process.hrtime(hrstart);
        sheet.getRows({
          offset: 1,
          orderby: 'col3'
        }, function( err, rows ){
          var hrend = process.hrtime(hrstart);
          console.log('GSheets API response ROWS in ' + hrend[0] + 's ' + hrend[1] / 1000000 + 'ms');
          if( typeof rows !== "undefined" ) {
            sessions = rows.filter(function (row) {
                return row.year === getYear();
              });
          }
          step();
        });
      }
    ], function(err){
        if( err ) {
          console.log('Error: '+err);
          callback(null, err)
        } else {
          callback(sessions);
        }
    });
}

var getYear = function() {
  return (process.env.UKGC_YEAR) ? process.env.UKGC_YEAR : (new Date()).getFullYear();
}

var getSpreadsheetKey = function() {
  return process.env.UKGC_SPREADSHEET_URL.match(/[-\w]{25,}/);
}

var checkEssentialConfig = function(config, callback) {
  var errorConstruction = [];
  if(!config.UKGC_PRIVATE_KEY) {
    errorConstruction.push('UKGC_PRIVATE_KEY is not set.');
  }
  if(!config.UKGC_CLIENT_EMAIL) {
    errorConstruction.push('UKGC_CLIENT_EMAIL is not set.');
  }
  if(!config.UKGC_SPREADSHEET_URL) {
    errorConstruction.push('UKGC_SPREADSHEET_URL is not set.');
  }
  if(errorConstruction.length !== 0) {
    errorConstruction.unshift('Required environment variables are not set:');
    var errorMessage = errorConstruction.join(' ');
  }
  callback(errorMessage);
}