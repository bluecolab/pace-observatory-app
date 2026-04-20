# Health Checks

## Health-check-hudson

**January 19, 2026** - The USGS WaterServices API has been updated which will result in significant changes in our use of the API. You can sign up for API key here: https://api.waterdata.usgs.gov/signup

A simple Python Script that will test all the Hudson River locations we use. The script should generate a PDF for each location with information on health of each station and their data.

Error conditions:

- If there is low variability of data (i.e. same value for 30 days)
- If the last data point from the API is more then 3 days old

Actions needed:

- Wait for USGS to fix the station (ignore the problem and let app error handling to take care of it)
- Remove the location from the app

## Logcat Error Parser

A Python script that when inputted [logcat](https://developer.android.com/studio/debug/logcat) files, it will produce a JSON file that only shows the "ERROR" messages.

### How to get logcat logs?

See the [wiki](https://github.com/bluecolab/BlueColab_MobileDataViz/wiki/Debugging-Tips-and-Tricks). Put the logcat file in the /logcat-error-parser/input directory.
