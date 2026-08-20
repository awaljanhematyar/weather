const apiKey = "33c9c1bd1b2358e3d58a6a7abf09f2e7";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  if (!city) return; // Prevent empty search

  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  // Show error if city not found
  if (response.status === 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    return;
  }

  const data = await response.json();

  console.log(data);

  // Update weather info
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".feels-like").innerHTML =
    `احساس: ${Math.round(data.main.feels_like)}°C`;
  document.querySelector(".high-low").innerHTML =
    `${Math.round(data.main.temp_max)}° / ${Math.round(data.main.temp_min)}°`;
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  // Change weather icon
  if (data.weather[0].main === "Clouds") {
    weatherIcon.src = "images/clouds.png";
  } else if (data.weather[0].main === "Clear") {
    weatherIcon.src = "images/clear.png";
  } else if (data.weather[0].main === "Rain") {
    weatherIcon.src = "images/rain.png";
  } else if (data.weather[0].main === "Drizzle") {
    weatherIcon.src = "images/drizzle.png";
  } else if (data.weather[0].main === "Mist") {
    weatherIcon.src = "images/mist.png";
  }

  // Show weather, hide error
  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
  }
});

// Optional: Load default city when page loads
window.addEventListener("load", () => {
  checkWeather("kabul");
});
