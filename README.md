# Unconference live session grid

Produces an easy-to-browse session listing site based off a Google Spreadsheet. Updates live when the spreadsheet is updated. [Made by Convivio](https://weareconvivio.com)



**Demo site:** https://unconf-session-test.herokuapp.com/

**Demo spreadsheet:** https://docs.google.com/spreadsheets/d/1uyeVc73aeKG8xgHvUzqR_WYbr3WPhsrk9gj746Mayac/edit?usp=drive_web&ouid=101644837907742352061

## Environment settings

```
// Required: Google Developer Authentication settings 
UKGC_PRIVATE_KEY
UKGC_CLIENT_EMAIL
// Required: The URL of the spreadsheet to pull from
UKGC_SPREADSHEET_URL
// Option: The number of seconds to pull new session information from the google sheet
// This is set to 5 seconds by default, increase this if you see the app struggling to serve requests in a timely fashion
CACHE_TIMEOUT
// The url of the logo image to use in the heading
LOGO_URL
// The name of the unconference for headings and meta tags
UNCONF_NAME
// Optionally set the year to filter the sessions by, defaults to current year.
UKGC_YEAR
```

## Setting up your spreadsheet

This tool was originally designed for [UKGovcamp](https://www.ukgovcamp.com/) and currently follows the structure of [their session spreadsheet.](https://docs.google.com/spreadsheets/d/1S6nemSPxSLrURGigaQZFKViWBoAhalpE2f0RtZ92Fpk/edit#gid=11) We'd recommend cloning that spreadsheet to ensure this works as expected.

If you'd like to deviate from the columns in the spreadsheet and would like support, feel free to open an issue.

### Google authentication set up

1. Go to the [Google Developers Console](https://console.developers.google.com/project)
2. Select your project or create a new one (and then select it)
3. Enable the Drive API for your project
  - In the sidebar on the left, expand __APIs & auth__ > __APIs__
  - Search for "drive"
  - Click on "Drive API"
  - click the blue "Enable API" button
4. Create a service account for your project
  - In the sidebar on the left, expand __APIs & auth__ > __Credentials__
  - Click blue "Add credentials" button
  - Select the "Service account" option
  - Select "Furnish a new private key" checkbox
  - Select the "JSON" key type option
  - Click blue "Create" button
  - your JSON key file is generated and downloaded to your machine (__it is the only copy!__)
  - note your service account's email address (also available in the JSON key file)
5. Share the doc (or docs) with your service account using the email noted above
