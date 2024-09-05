const fetchDataBtn = document.getElementById('fetchDataBtn');
const mapDiv = document.getElementById('map');
const weatherDiv = document.getElementById('weather');

// Your OpenWeatherMap API key
const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';

// Handle click event for the Fetch Data button
fetchDataBtn.addEventListener('click', () => {
    // Get the user's geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Display Google Maps with user's location
            displayMap(lat, lon);

            // Fetch weather data using OpenWeatherMap API
            fetchWeatherData(lat, lon);
        }, showError);
    } else {
        weatherDiv.textContent = "Geolocation is not supported by this browser.";
    }
});

// Display Google Maps with a marker at the user's location
function displayMap(lat, lon) {
    const mapIframe = document.createElement('iframe');
    mapIframe.width = "100%";
    mapIframe.height = "300px";
    mapIframe.style.border = "0";
    mapIframe.src = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
    mapDiv.innerHTML = ""; // Clear the previous map
    mapDiv.appendChild(mapIframe);
}

// Fetch weather data from OpenWeatherMap API
function fetchWeatherData(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            weatherDiv.textContent = "Error fetching weather data.";
            console.error("Error:", error);
        });
}

// Display weather data on the page
function displayWeatherData(data) {
    const { temp, humidity } = data.current;
    const description = data.current.weather[0].description;
    
    weatherDiv.innerHTML = `
        <h2>Current Weather</h2>
        <p>Temperature: ${temp} °C</p>
        <p>Weather: ${description}</p>
        <p>Humidity: ${humidity}%</p>
    `;
}

// Handle geolocation errors
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            weatherDiv.textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            weatherDiv.textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            weatherDiv.textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            weatherDiv.textContent = "An unknown error occurred.";
            break;
    }
}