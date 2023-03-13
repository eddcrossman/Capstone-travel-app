// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
//app.use(express.static('website'));

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
    //res.sendFile(path.resolve('src/client/views/index.html'))
});

// Setup Server
const port = 1982;
const server = app.listen(port,() => {
    console.log(`server up and running`);
    console.log(`running on localhost: ${port}`);
})

/* ROUTES */

// GET route
const getDataRouteURL = '/getData';
app.get(getDataRouteURL, (req,res) => {
    console.log(`${getDataRouteURL} called`);
    res.send(projectData);
})

// POST route
const postDataRouteURL = '/postData';
app.post(postDataRouteURL, postData);

function postData (req,res) {
    console.log(`${postDataRouteURL} called`);
    projectData = {
        temp: req.body.temp,
        date: req.body.date,
        content: req.body.content
    }
    res.send(projectData);
}