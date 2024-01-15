const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const getCityCoordinates = () => {
  const cityLocation = cityInput.value.trim();
  if (!cityLocation) return;
  console.log(cityLocation);
};

searchButton.addEventListener("click", getCityCoordinates);
