/* Global Variables */

const API_KEY = '3ab5a633cc7c5ba01ebd9327b3f4bcbf&units=';
const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';
const APP_BASE_URL = 'http://localhost:1982';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate()+'.'+ d.getMonth() +'.'+ d.getFullYear();

async function getData(url){
    const result = await fetch(url);

    //400+ status does not result in an error, therefore need to check for these before proceeding
    if (!result.ok) {
        throw Error(result.status);
    }

   try {
        let data  = await result.json()
        return data;
    } catch(error) {
        console.log('getData() error', error);
    }
}

async function postData(url, data){
    const response = await fetch(`${url}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;

    } catch(error) {
        console.log("postData() error:", error);
    }
}

//Gets data from openweather API based on zipcode and country code, using correct units for each
function getOpenWeatherURL(zipCode, countryCode){
    const url = `${OPEN_WEATHER_BASE_URL}zip=${zipCode},${countryCode}&appid=${API_KEY}`;

    if (countryCode === 'US') {
        return url + 'imperial';
    } else {
        return url + 'metric';
    }
}

function clickFunction() {
    const zipCode = document.getElementById('zip').value;
    const countryCode = document.getElementById('country').value;

    getData(getOpenWeatherURL(zipCode,countryCode))
    
    .then(async (data)=>{
        const newData = {
            temp: data.main.temp,
            date: newDate,
            content: document.getElementById('feelings').value
        }
        await postData(`${APP_BASE_URL}/postData`, newData);
    })
    
    .then(async ()=>{
        const data = await getData(`${APP_BASE_URL}/getData`);
        const splitDate = data.date.split('.');
        const date = new Date(splitDate[2],splitDate[1],splitDate[0]);

        document.getElementById('date').innerHTML = date.toDateString();
        document.getElementById('content').innerHTML = data.content;

        if (countryCode === 'US') {
            document.getElementById('temp').innerHTML = data.temp + '\u00B0F';
        } else {
            document.getElementById('temp').innerHTML = data.temp + '\u00B0C';
        }
    })
    
    .catch((error)=> {
        console.log(error);
        if(error.message === '400') {
            window.alert('Please enter post code and try again');

        } else if (error.message === '404') {
            window.alert('Post code not found, please check and try again');
        } else {
            window.alert('Error - please check and try again');
        }
    });
}

document.getElementById('generate').addEventListener('click', clickFunction);