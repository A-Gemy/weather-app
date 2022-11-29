/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '336d612ce18294c7478ecd30173d9163';  // this is my personal key 

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Select generate button and callback a function
document.getElementById('generate').addEventListener('click', action);

function action(e) {
    e.preventDefault();

    const userInfo = document.getElementById('userInfo');
    //Get user input
    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;

    getWeatherDataFromAPI(baseUrl, zipCode, apiKey)
        .then(function(userData) {
            // Add data to POST request
            postData('/add', {
                temp: userData.main.temp,
                date: newDate,
                content: content 
            });
        }).then(function() {
            // Call updateUI to update browser content
            updateUI()
        })
        // Catch error if any
        .catch( (error) => {
            console.log(error);
        });
    // Reset form inputs to reuse
    userInfo.reset();
}


/* Function to GET Web API Data*/
const getWeatherDataFromAPI = async(baseUrl, zipCode, apiKey) => {
    const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
    try {
        // data equals to the result of fetch function
        const data = await res.json();
        return data;
    } 
    // Catch error if any
    catch (error) {
        console.log('error', error);
    }
};


/* Function to POST data */
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content
        })
    });
    try {
        const newData = await response.json();
        return newData;
    } 
    // Catch error if any
    catch (error) {
        console.log(error);
    }
};


// function to update browser content
const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = (allData.temp - 273.15).toFixed(2) + ' C';
        document.getElementById('content').innerHTML = allData.content;
    }
    // Catch error if any
    catch (error) {
        console.log('error', error);
    }
};

// 