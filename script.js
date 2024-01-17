const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherDiv = document.querySelector(".weather-cards");

const API_KEY = "971a8ff9a55506f06943d101299eb1a4";

const makeWeatherCard = (cityLocation, weatherSelection, index) => {
  if (index === 0) {
    return `<div class="current-weather">
    <div class="details">
      <h2> ${cityLocation} (${weatherSelection.dt_txt.split(" ")[0]})</h2>
      <h4>Temperature: ${(weatherSelection.main.temp - 273.15).toFixed(
        2
      )}°C</h4>
      <h4>Wind: ${weatherSelection.wind.speed} M/S</h4>
      <h4>Humidity: ${weatherSelection.main.humidity}%</h4>
    </div>`;
  } else {
    return `<li class="card">
    <h3>(${weatherSelection.dt_txt.split(" ")[0]})</h3>
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
  }
};

const getWeatherDetails = (cityLocation, lat, lon) => {
  const OPENWEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

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
      currentWeatherDiv.innerHTML = "";
      weatherDiv.innerHTML = "";

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherSelection, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML(
            "beforeend",
            makeWeatherCard(cityLocation, weatherSelection, index)
          );
        } else {
          weatherDiv.insertAdjacentHTML(
            "beforeend",
            makeWeatherCard(cityLocation, weatherSelection, index)
          );
        }
      });
    })
    .catch(() => {
      alert("An error occured while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityLocation = cityInput.value.trim();
  if (!cityLocation) return;
  //   const OPENWEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  const OPENWEATHER_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityLocation}&limit=1&appid=${API_KEY}`;
  console.log(cityLocation);

  fetch(OPENWEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length)
        return alert(`No coordinates found for ${cityLocation}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch((error) => {
      console.log(error);
      //   alert("An error occured while fetching the coordinates");
    });
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=&appid=${API_KEY}`;
      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          const { name } = data[0];
          //   if (!data.city || !data.city.coord) {
          //     return alert(`No coordinates found for ${cityLocation}`);
          //   }
          //   const { name, coord } = data.city;
          //   const { lat, lon } = coord;
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("An error occured while fetching the city");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied. Please reset location permission to grant access again"
        );
      }
    }
  );
};
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);

const historyList = document.querySelector(".search-history");

const addToSearchHistory = (city) => {
  const historyItem = document.createElement("li");
  historyItem.textContent = city;
  historyItem.addEventListener("click", () => {
    cityInput.value = city;
    getCityCoordinates();
  });
  historyList.appendChild(historyItem);
};

const updateSearchHistory = (city) => {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    addToSearchHistory(city);
  }
};

const loadSearchHistory = () => {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory.forEach((city) => addToSearchHistory(city));
};

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", () => {
  getCityCoordinates();
  updateSearchHistory(cityInput.value.trim());
});
cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    getCityCoordinates();
    updateSearchHistory(cityInput.value.trim());
  }
});

loadSearchHistory();
