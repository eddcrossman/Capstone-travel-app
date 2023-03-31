/* Global Variables */
const APP_BASE_URL = 'http://localhost:1982';
const destinationsArray = [];

/*  fetches data from url passed as argument and returns the result of that fetch
    */
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

/*  fetches data from url passed as argument using POST method, body of request is passed as second argument
    */
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

/*  uses server /getpicture route to return a picture based on location data passed as argument.  
    if no results are returned makes further attempts removing the last property from the data object each time
    until a picture is found 
    */
async function getPicture(data) {
    console.log(`getPicture() called`);
    const newData = await postData(`${APP_BASE_URL}/getPicture`, data);

    if (newData.totalHits > 0) {
        return newData

    } else {
        let dataArray = [];
        let dataObj = {};

        for (const property in data) {
            dataArray.push(data[property]);
        }

        dataArray = dataArray.slice(0,-1);

        for(const x in dataArray) {
           dataObj[x] = dataArray[x];
        }

        return getPicture(dataObj);
    };
}

/*  uses server /getlatlong route to return a location data based on a city name passed as argument.  If more than one
    city is found with that name then select element is populated with details of each.  awaitDestinationSelect() function is 
    called and user notified the are to select the correct city from the list
    */
async function getLatLong(destination) {
    console.log(`getLatLong(${destination}) called`);

    let data  = await getData(`${APP_BASE_URL}/getLatLong/${destination}`)

    if (data.length == 0) {
        throw Error('No destination found');
    }
    else {        
        //duplicates removed from data
        let dupesArray = [];

        for (let x = 0; x < data.length; x++) {
            for (let y = (x + 1); y < data.length; y++) {
                if (data[x].country == data[y].country && data[x].state == data[y].state && data[x].county == data[y].county) {
                    dupesArray.push(y);
                }
            }
        }
        dupesArray = [...new Set(dupesArray)];

        if (data.length - dupesArray.length == 1) {
            data = data[0];
        }
        else {
            alert('More than one destination found! Please select yours from the list');

            const selectDestinationElement = document.getElementById('destination-select');
            const optionTextArray = ['county','state','country'];
            const documentFragment = document.createDocumentFragment();

            for (const i in data) {
                if (! dupesArray.includes(Number(i))) {
                    const newSelectOption = document.createElement('OPTION');
                    let optionTextString = "";

                    for (const x of optionTextArray) {
                        if (typeof data[i][x] != 'undefined') {
                            optionTextString += `${data[i][x]} - `;
                        }
                    }

                    optionTextString = optionTextString.slice(0, -3);
                    newSelectOption.innerHTML = optionTextString;
                    newSelectOption.setAttribute('Value', i)
                    documentFragment.append(newSelectOption);
                }
            }
            selectDestinationElement.innerHTML = '<option value=""></option>';
            selectDestinationElement.appendChild(documentFragment);
            await awaitDestinationSelect(); //wait for result of user input if more than 1 city is found
            data = data[selectDestinationElement.value];
        }
    }

    return data;    
}

/*  uses server /getCountryInfo route to data about a country passed as argument
    */
async function getCountryData(country) {
    console.log(`getCountryData(${country}) called`);

    const data = await getData(`${APP_BASE_URL}/getCountryInfo/${country}`);

    if (data.length == 0) {
        return data;
    } else {
        for (const i of data) {
            if (country == i.name.common) {
                return i;
            }
        }
    }
}

/*  Called when more than one destination is returned from getLatLong() funciton.  Enables select element and awaits user input
    */
function awaitDestinationSelect() {
    console.log('awaitDestinationSelect() called');
    const selectDestinationElement = document.getElementById('select-input-group');
    selectDestinationElement.style.display = "inline-flex";

    for (const i of document.getElementsByTagName('INPUT')) {
        i.disabled = true;
    }

    for (const i of document.getElementsByTagName('BUTTON')) {
        i.disabled = true;
    }

    document.getElementById('cancel').disabled = false;

    return new Promise(function (resolve, reject) {
        document.getElementById('destination-select').addEventListener('change', function () {
            console.log('awaitDestinationSelect() resolving');
            resolve();
      }, {once: true});
    });
}

/*  checks user has entered information in all required inputs.  An additional check is made to ensure the dates are within
    the time period allowed by the free weatherbit API 
    */
function validateInputs() {
    const startDate = document.getElementById('start-date-select').value;
    const endDate = document.getElementById('end-date-select').value;
    const destination = document.getElementById('destination-text-input').value;

    if (destination == "") {
        throw new Error('Please enter a destination and try again');
    }
    else if (startDate == ""){
        throw new Error('Please enter a start date and try again');
    }
    else if (endDate == ""){
        throw new Error('Please enter an end date and try again');
    }
    else {
        const lastValidDate = new Date();
        lastValidDate.setDate(lastValidDate.getDate() + 7);

        if (new Date(endDate) > lastValidDate) {
            throw new Error('For testing purposes only dates up to 7 days in the future can be entered, please check and try again');
        }
    }
}

/*  updates date select elements so no past dates can be entered and to ensure the end date is always after the start date
    */
function updateDateElements(minimumDate, both){
    const endDateElement = document.getElementById('end-date-select');
    const date = new Date(minimumDate);
    const dateString = date.getFullYear()+'-'+("0" + (date.getMonth()+1)).slice(-2)+'-'+date.getDate(); 
    
    endDateElement.setAttribute('min', dateString);

    if (both) {
        const startDateElement = document.getElementById('start-date-select');
        startDateElement.setAttribute('min', dateString);
    }
}

/*  clears all input elements, hides the select element and enables all buttons
    */
function clearInputs() {
    console.log('clearInputs() called');

    const selectDestinationElement = document.getElementById('destination-select');
    selectDestinationElement.replaceWith(selectDestinationElement.cloneNode(false));
    document.getElementById('select-input-group').style.display = "none";

    for (const i of document.getElementsByTagName('INPUT')) {
        i.value = "";
        i.disabled = false;
    }

    for (const i of document.getElementsByTagName('BUTTON')) {
        i.disabled = false;
    }

    document.getElementById('ok').disabled = false;
}

/*  removes a destination from the destinationsArray based on that destination's cardElement passed as argument to the function 
    */
function removeDestination(cardElement) {
    for (const i in destinationsArray) {
        if (destinationsArray[i].cardElement === cardElement) {
            destinationsArray[i].cardElement.remove();
            destinationsArray.splice(i,1);
            break;
        }
    }
    updateUI();
}

/*  main function called when user clicks to add destination.  creates an output object and populates with data returned from 
    above functions called in sequence.  Passes this object to newDestinationCard method to add that destination to the main
    destinationsArray and calls updateUI to update the DOM.
    */
async function addDestination() {
    const destination = document.getElementById('destination-text-input').value;
    const startDate = document.getElementById('start-date-select').value;
    const endDate = document.getElementById('end-date-select').value;

    const outputObj = {
        bestPhoto: "",
        date: "",
        geoapify: "",
        pixabay: "",
        restcountries: "",
        weatherbit: ""
    };
    
    try {
        validateInputs();

        outputObj.date = {
            startDate: startDate,
            endDate: endDate,
            monthString: startDate.toLocaleString('default', { month: 'long' })
        }

        outputObj.geoapify = await getLatLong(destination);
        outputObj.weatherbit = await postData(`${APP_BASE_URL}/getWeather`, {
            lat: outputObj.geoapify.lat,
            lon: outputObj.geoapify.lon,
            })

        outputObj.pixabay = await getPicture({
                state: outputObj.geoapify.state,
                city: outputObj.geoapify.city,
                month: outputObj.date.month,
                county: outputObj.geoapify.county,
                country: outputObj.geoapify.country
            })

        outputObj.bestPhoto = {
            likeRatio: 0,
            url: outputObj.pixabay.hits[0].webformatURL
        }

        outputObj.restcountries = await getCountryData(outputObj.geoapify.country);

        newDestinationCard(outputObj);
        updateUI();

    } catch(error) {
        console.log(error);
        window.alert(error.message);
    }
}

/*  creates a new CARD element based on the location data passed as an argument this is added to the main destinations array
    along with the data object
*/
function newDestinationCard(outputObj) {
    const newElementID = `${outputObj.geoapify.city}-${outputObj.date.startDate}`
    const startDate = new Date(outputObj.date.startDate);
    const endDate = new Date(outputObj.date.endDate);
    const documentFragment = document.createDocumentFragment();
    const newCard = document.getElementById('card-template').firstElementChild.cloneNode(true);
    let newCardElements = newCard.childNodes;

    newCard.id = newElementID;

    for (let i = newCardElements.length - 1; i >= 0; i--) {
        if (typeof newCardElements[i] != 'undefined') {
            newCardElements[i].id = `${newCardElements[i].tagName}-${newElementID}`;
        }
    }

    documentFragment.append(newCard);

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    //update card HEADER
    const headerElement = documentFragment.getElementById(`HEADER-${newElementID}`);
    let headerHTML = `<h2>${outputObj.geoapify.city} - ${outputObj.geoapify.state} - ${outputObj.geoapify.country}</h2>`;
    headerHTML += `<h3>From: ${startDate.toLocaleDateString(undefined, dateOptions)}<br>To: ${endDate.toLocaleDateString(undefined, dateOptions)}</h3>`;
    headerElement.innerHTML = headerHTML;

    //update image
    documentFragment.getElementById(`IMG-${newElementID}`).setAttribute('src', outputObj.bestPhoto.url);

    //update section with weather info
    const sectionElement = documentFragment.getElementById(`SECTION-${newElementID}`)

    sectionElement.innerHTML = `<h3>HOLIDAY WEATHER</h3>`;

    for (const i of outputObj.weatherbit) {
        const date = new Date(i.datetime);
        
        if (date >= startDate && date <= endDate) {
            sectionElement.innerHTML += `<p><b><u>${date.toLocaleDateString(undefined, dateOptions)}</u></b><br>${i.weather.description}</p>`;
        }
    }

    //update section with country info
    sectionElement.innerHTML += `<h3>COUNTRY INFO</h3>`;
    sectionElement.innerHTML += `<p><b><u>Official Name</u></b><br>${outputObj.restcountries.name.official}</p>`;
    sectionElement.innerHTML += `<p><b><u>Capital City</u></b><br>${outputObj.restcountries.capital}</p>`;
    sectionElement.innerHTML += `<p><b><u>Population</u></b><br>${outputObj.restcountries.population.toLocaleString('en-US')}</p>`;

    let currencyHTML = `<p><b><u>Currency</u></b>`
    for (const i in outputObj.restcountries.currencies) {
        currencyHTML += `<br>${outputObj.restcountries.currencies[i].name} - ${outputObj.restcountries.currencies[i].symbol}`;
    }
    sectionElement.innerHTML += `${currencyHTML}</p>`
    sectionElement.innerHTML += `<img src="${outputObj.restcountries.flags.png}" alt="${outputObj.restcountries.flags.alt}">`

    newCard.classList.remove('card-template');
    newCard.classList.add('card');
    destinationsArray.push({
        cardElement: newCard,
        data: outputObj
        });
}

/*  called when a new destination is added or one is removed.  sorts the main destinations array based on the start dates of the trips
    in the array and updates the DOM
    */
function updateUI() {
    const newDiv = document.createElement('DIV');
    const date = new Date();
    
    newDiv.classList.add('main');
    newDiv.id = 'main';

    document.getElementById('main').remove();

    destinationsArray.sort((a, b) => new Date(a.data.date.startDate) - new Date(b.data.date.startDate));
    for (const i of destinationsArray) {
        const startDate = new Date(i.data.date.startDate);
        const daysLeft = Math.ceil((startDate.getTime() - date.getTime()) / (1000 * 3600 * 24));
        const daysLeftElement = i.cardElement.querySelector('footer').firstElementChild;
        daysLeftElement.innerHTML = `COUNTDOWN... ${daysLeft} days to go until your trip!!`;
        newDiv.appendChild(i.cardElement);
    }

    document.getElementById('container').insertBefore(newDiv,document.getElementById('footer'));
    clearInputs();
}

/*  listener funciton called when click event is triggered.
    */
function clickEventFunction(event){
    if (event.target.classList.contains('delete-button')) {
        removeDestination(event.target.parentElement.parentElement);
    }
    else if (event.target.id == 'ok') {
        addDestination();
    }
    else if (event.target.id == 'cancel') {
        clearInputs();
    }
}

export { clickEventFunction }
export { updateDateElements }
export { addDestination }
export { getData }