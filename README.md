# Unconference live session grid

Produces an easy-to-browse session listing site based off a Google Spreadsheet. Updates live when the spreadsheet is updated.

## .env settings

```
// Required: Google Developer Authentication settings 
UKGC_PRIVATE_KEY
UKGC_CLIENT_EMAIL
// Required: The URL of the spreadsheet to pull from
UKGC_SPREADSHEET_URL
// The url of the logo image to use in the heading
LOGO_URL
// The name of the unconference for headings and meta tags
UNCONF_NAME
// Optionally set the year to filter the sessions by, defaults to current year.
UKGC_YEAR
```
