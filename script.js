document
  .getElementById("get-weather-btn")
  .addEventListener("click", function () {
    const country = document.getElementById("country-input").value.trim();
    const weatherResult = document.getElementById("weather-result");

    weatherResult.innerHTML = ""; // Clear previous results
    weatherResult.style.opacity = 0; // Reset opacity for animation

    if (country === "") {
      weatherResult.innerHTML = "<p>Please enter a country name.</p>";
      animateResult();
      return;
    }

    // Get the capital city of the country
    fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status || data.length === 0) {
          weatherResult.innerHTML = "<p>Country not found.</p>";
          animateResult();
        } else {
          const capital = data[0].capital[0];
          const countryName = data[0].name.common;
          const lat = data[0].capitalInfo.latlng[0];
          const lon = data[0].capitalInfo.latlng[1];

          // Get weather data for the capital city using Open-Meteo API
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
          )
            .then((response) => response.json())
            .then((weatherData) => {
              if (weatherData.current_weather) {
                const temperature = weatherData.current_weather.temperature;
                const windspeed = weatherData.current_weather.windspeed;
                const weatherCode = weatherData.current_weather.weathercode;
                const iconUrl = getWeatherIconUrl(weatherCode);

                weatherResult.innerHTML = `
                                <h2>Weather in ${capital}, ${countryName}</h2>
                                <img src="${iconUrl}" class="weather-icon" alt="Weather Icon">
                                <p><strong>Temperature:</strong> ${temperature} °C</p>
                                <p><strong>Wind Speed:</strong> ${windspeed} km/h</p>
                            `;
                animateResult();
              } else {
                weatherResult.innerHTML =
                  "<p>Unable to fetch weather data.</p>";
                animateResult();
              }
            })
            .catch((error) => {
              weatherResult.innerHTML = "<p>Error fetching weather data.</p>";
              animateResult();
            });
        }
      })
      .catch((error) => {
        weatherResult.innerHTML = "<p>Error fetching country data.</p>";
        animateResult();
      });
  });

// Function to map weather codes to icon URLs
function getWeatherIconUrl(code) {
  // Use OpenWeatherMap icons as they are free and hosted
  const iconMappings = {
    0: "01d", // Clear sky
    1: "02d", // Mainly clear
    2: "03d", // Partly cloudy
    3: "04d", // Overcast
    45: "50d", // Fog
    48: "50d", // Depositing rime fog
    51: "09d", // Drizzle light
    53: "09d", // Drizzle moderate
    55: "09d", // Drizzle dense
    56: "09d", // Freezing drizzle light
    57: "09d", // Freezing drizzle dense
    61: "10d", // Rain slight
    63: "10d", // Rain moderate
    65: "10d", // Rain heavy
    66: "13d", // Freezing rain light
    67: "13d", // Freezing rain heavy
    71: "13d", // Snow fall slight
    73: "13d", // Snow fall moderate
    75: "13d", // Snow fall heavy
    77: "13d", // Snow grains
    80: "09d", // Rain showers slight
    81: "09d", // Rain showers moderate
    82: "09d", // Rain showers violent
    85: "13d", // Snow showers slight
    86: "13d", // Snow showers heavy
    95: "11d", // Thunderstorm slight
    96: "11d", // Thunderstorm with slight hail
    99: "11d", // Thunderstorm with heavy hail
  };

  const iconCode = iconMappings[code] || "01d";
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Function to animate the weather result using Anime.js
function animateResult() {
  anime({
    targets: "#weather-result",
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: "easeOutQuad",
  });
}
