const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const API_KEY = "5b9a9120e861102dff13f3f406afec27";

const getWeatherDetails = (cityLocation, lat, lon) => {
  const OPENWEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

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

      console.log(fiveDaysForecast);
    })
    .catch(() => {
      alert("An error occured while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityLocation = cityInput.value.trim();
  if (!cityLocation) return;
  const OPENWEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=${API_KEY}`;
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
