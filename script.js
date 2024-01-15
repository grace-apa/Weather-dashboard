const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherDiv = document.querySelector(".weather-cards");

const API_KEY = "971a8ff9a55506f06943d101299eb1a4";

const makeWeatherCard = (weatherSelection) => {
  return `<li class="card">
  <h3>(${weatherSelection.dt_txt.split("")[0]})</h3>
  <img
src="https://openweathermap.org/img/wn/${
    weatherSelection.weather[0].icon
  }@4x.png"
alt="weather-icon"
/>
  <h4>Temp: ${(weatherSelection.main.temp - 273.15).toFixed(2)}°C</h4>
  <h4>Wind: ${weatherSelection.wind.speed} M/S</h4>
  <h4>Humidity: ${weatherSelection.main.humidity}%</h4>
</li>`;
};

const getWeatherDetails = (cityLocation, lat, lon) => {
  const OPENWEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`;

  fetch(OPENWEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const specificForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!specificForecastDays.includes(forecastDate)) {
          return specificForecastDays.push(forecastDate);
        }
      });

      cityInput.value = "";
      weatherDiv.innerHTML = "";

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherSelection) => {
        weatherDiv.insertAdjacentHTML(
          "beforeend",
          makeWeatherCard(weatherSelection)
        );
      });
    })
    .catch(() => {
      alert("An error occured while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityLocation = cityInput.value.trim();
  if (!cityLocation) return;
  const OPENWEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`;
  console.log(cityLocation);

  fetch(OPENWEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length)
        return alert(`No coordinates found for ${cityLocation}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occured while fetching the coordinates");
    });
};

searchButton.addEventListener("click", getCityCoordinates);
