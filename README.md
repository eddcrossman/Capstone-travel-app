## 

## Table of Contents

* [Table of contents](#table-of-contents)
* [Project description](#project-description)
* [Usage](#usage)
* [Dependencies](#dependencies)

## Project description
[(Back to top)](#table-of-contents)
The aim of the project was to build a travel app that, obtains a desired trip location & date from the user, and displays weather and an image of the location using information obtained from external APIs.  In addition to this I added functionality to add more than one location to each trip as well as delete locations if they were no longer desired.  I also added info regarding the country to the output.

## Usage
[(Back to top)](#table-of-contents)
To build a dist folder of produciton code type `npm run build-prod` in a terminal.  To start the server and run the project type `npm run start`.  You can now view the project running in a browser at [localhost:1982](http://localhost:1982/).

To run the project in Development Mode use `npm run build-dev-server` in your terminal.  This will open the main page in your browser.  The server also needs to be running or the fetch calls will fail.

To run JEST tests type `npm test` in a terminal.

NOTE - for testing only dates up to 7 days in the future can be entered, this is due to the limitations of the weatherbit API free version.

## Dependencies
[(Back to top)](#table-of-contents)

Node version 14.21.3. The other dependencies can be found in the package.json file.