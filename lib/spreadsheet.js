require('dotenv').config()
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

var doc;
var sheet;
var sessions;

var getYear = function() {
    return (process.env.UKGC_YEAR) ? process.env.UKGC_YEAR : (new Date()).getFullYear();
 }

 var getSpreadsheetKey = function() {
    return process.env.UKGC_SPREADSHEET_URL.match(/[-\w]{25,}/);
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
        doc.getInfo(function(err, info) {
          if( typeof info !== "undefined" ) {
            console.log('Loaded doc: '+info.title+' by '+info.author.email);
            sheet = info.worksheets[0];
            console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
          }
          step();
        });
      },
      function workingWithRows(step) {
        sheet.getRows({
          offset: 1,
          orderby: 'col3'
        }, function( err, rows ){
          if( typeof rows !== "undefined" ) {
            sessions = rows.filter(function (row) {
                return row.year === getYear();
              });
            console.log('Got '+sessions.length+' sessions for ' + getYear());
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