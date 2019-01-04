require('dotenv').config()
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

var doc = new GoogleSpreadsheet('1S6nemSPxSLrURGigaQZFKViWBoAhalpE2f0RtZ92Fpk');
var sheet;
var sessions;

async.series([
    function setAuth(step) {
      var creds = {
        client_email: process.env.UKGC_CLIENT_EMAIL,
        private_key: process.env.UKGC_PRIVATE_KEY.replace(/\\n/g, '\n')
      }

      doc.useServiceAccountAuth(creds, step);
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo(function(err, info) {
        console.log('Loaded doc: '+info.title+' by '+info.author.email);
        sheet = info.worksheets[0];
        console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
        step();
      });
    },
    function workingWithRows(step) {
      sheet.getRows({
        offset: 1,
        orderby: 'col3'
      }, function( err, rows ){
          sessions =  rows.filter(function (row) {
              return row.year === getYear();
            });
        console.log('Got '+sessions.length+' sessions for ' + getYear());
        step();
      });
    }
  ], function(err){
      if( err ) {
        console.log('Error: '+err);
      }
  });

 var getYear = function() {
    return (process.env.UKGC_YEAR) ? process.env.UKGC_YEAR : (new Date()).getFullYear();
 }