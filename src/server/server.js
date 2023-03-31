// Require Express to run server and routes.  Start up an instance of app
const express = require('express');
const app = express();
app.use(express.static('dist'));
console.log(__dirname);

/* Middleware*/
//Configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

//Fetch to make request from API
const fetch = require('node-fetch');

//Dotenv to hide API keys
const dotenv = require('dotenv');
dotenv.config();

// Setup Server
const port = 1982;
const server = app.listen(port,() => {
    console.log(`server up and running`);
    console.log(`running on localhost: ${port}`);
})

/* ROUTES */

//Takes the city as a url parameter, uses this to search the GEOAPIFY API and returns the data via the res object.
app.get('/getLatLong/:city', getLatLong);

async function getLatLong(req, res) {
    console.log('/getLatLong called');

    const city = req.params.city;
    const geoapifyURL = `https://api.geoapify.com/v1/geocode/search?text=${city}&type=city&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;
    const response = await fetch(geoapifyURL, {
        method: 'GET',
    });    

    try {
        const newData = await response.json();
        console.log('/getLatLong data retrieved OK... sending');
        res.send(newData.results);

    } catch(error) {
        console.log(`/getLatLong/${city} ${error}`);
        res.status(response.status).send(error);
    }
}

//Takes latitude and longditude as parameters of the body object and returns 7 day weather forecast for that location
app.post('/getWeather', getWeather);

//weatherbit limited to 50 replies per day, testing set to true returns the same response for each
//request to avoid hitting this limit.
const testing = false;
let storedResponse;
let storedNewData;

async function getWeather(req, res) {
    console.log('/getWeather called');

    const lat = req.body.lat;
    const lon = req.body.lon;
    const weatherbitURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHERBIT_API_KEY}`

    let response;
    let newData;

    try {
        if (testing && typeof storedResponse !== 'undefined') {
            console.log('TESTING MODE: weatherObj found, no fetch required...')

            response = storedResponse;
            newData = storedNewData;
        }
        else {
            console.log('TESTING MODE: no weatherObj found, doing fetch...')
            response = await fetch(weatherbitURL, {
                method: 'GET',
            });
            newData = await response.json();

            storedResponse = JSON.parse(JSON.stringify(response));
            storedNewData = JSON.parse(JSON.stringify(newData));
        }

        console.log('/getWeather data retrieved OK... sending');
        return res.send(newData.data);     

    } catch(error) {
        console.log(`/getWeather/ ${error}`);
        res.status(response.status).send(error);
    }
}

//Searches for a picture using PIXABAY API.  Searches using all parameters passed via body object
app.post('/getPicture', getPicture);

async function getPicture(req, res) {
    console.log('/getPicture called');
    let pixabayURL = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=`

    //builds up url string from body object values, seperated by space characters (%20)
    for (const property in req.body) {
        const propertyString = req.body[property].replace(" ", "%20");
        pixabayURL += `${propertyString}%20`;
      }
    
    pixabayURL = pixabayURL.slice(0, -3);
    pixabayURL += `&image_type=photo&order=popular&orientation=horizontal`;

    const response = await fetch(pixabayURL, {
        method: 'GET',
    });

    try {
        const newData = await response.json();
        console.log('/getPicture data retrieved OK... sending');

        return res.send(newData);

    } catch(error) {
        console.log(`/getPicture/ ${error}`);
        res.status(response.status).send(error);
    }
}

//Searches for country information using RESTCOUNTRIES API, takes country name as url parameter
app.get('/getCountryInfo/:country', getCountryInfo);

async function getCountryInfo(req, res) {
    console.log('/getCountryInfo called');

    const country = req.params.country;
    const restCountriesURL = `https://restcountries.com/v3.1/name/${country}`;
    const response = await fetch(restCountriesURL, {
        method: 'GET',
    });

    try {
        const newData = await response.json();
        console.log('/getCountryInfo data retrieved OK... sending');
        res.send(newData);

    } catch(error) {
        console.log(`/getCountryInfo/${country} ${error}`);
        res.status(response.status).send(error);
    }
}

//export getLatLong function for testing
module.exports = { getLatLong };