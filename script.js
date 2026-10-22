// Key-free non-commercial portfolio demo using Open-Meteo.
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherPanel = document.querySelector(".weather");
const errorPanel = document.querySelector(".error");
const errorText = errorPanel.querySelector("p");
let activeRequest = 0;
let requestController;
searchBox.setAttribute("aria-label", "City name");
searchBtn.setAttribute("aria-label", "Search weather");
errorPanel.setAttribute("role", "status");
errorPanel.setAttribute("aria-live", "polite");
weatherPanel.style.display = "none";

function showError(message) {
  errorText.textContent = message;
  errorPanel.style.display = "block";
  weatherPanel.style.display = "none";
}
function iconForCode(code) {
  if (code === 0 || code === 1) return "clear.png";
  if (code === 2 || code === 3) return "clouds.png";
  if (code === 45 || code === 48) return "mist.png";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle.png";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow.png";
  return "rain.png";
}
function numberLabel(value, suffix) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) + suffix : "Unavailable";
}
async function checkWeather(city) {
  const name = String(city || "").trim();
  const requestId = ++activeRequest;
  if (requestController) requestController.abort();
  const controller = new AbortController();
  requestController = controller;
  if (name.length < 2) {
    searchBtn.disabled = false;
    weatherPanel.removeAttribute("aria-busy");
    showError("Enter a city name with at least two characters.");
    return;
  }
  searchBtn.disabled = true;
  weatherPanel.setAttribute("aria-busy", "true");
  errorPanel.style.display = "none";
  weatherPanel.style.display = "none";
  const timeout = setTimeout(() => controller.abort(), 15000);
  const signal = controller.signal;
  try {
    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.search = new URLSearchParams({ name, count: "1", language: "en", format: "json" });
    const geoResponse = await fetch(geoUrl, { signal });
    if (!geoResponse.ok) throw new Error("Location search failed");
    const geo = await geoResponse.json();
    if (requestId !== activeRequest) return;
    const place = geo.results?.[0];
    if (!place) { showError("City not found. Try a nearby city or add a country."); return; }
    if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) throw new Error("Invalid location");
    const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
    forecastUrl.search = new URLSearchParams({
      latitude: String(place.latitude), longitude: String(place.longitude),
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
      daily: "temperature_2m_max,temperature_2m_min", timezone: "auto",
      forecast_days: "1", temperature_unit: "celsius", wind_speed_unit: "kmh"
    });
    const response = await fetch(forecastUrl, { signal });
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    if (requestId !== activeRequest) return;
    if (!data.current || !Number.isFinite(data.current.temperature_2m)) throw new Error("Weather data unavailable");
    const current = data.current;
    document.querySelector(".city").textContent = [place.name, place.country].filter(Boolean).join(", ");
    document.querySelector(".temp").textContent = numberLabel(current.temperature_2m, "°C");
    document.querySelector(".feels-like").textContent = "Feels like: " + numberLabel(current.apparent_temperature, "°C");
    document.querySelector(".high-low").textContent = numberLabel(data.daily?.temperature_2m_max?.[0], "°") + " / " + numberLabel(data.daily?.temperature_2m_min?.[0], "°");
    document.querySelector(".humidity").textContent = numberLabel(current.relative_humidity_2m, "%");
    document.querySelector(".wind").textContent = numberLabel(current.wind_speed_10m, " km/h");
    weatherIcon.src = "images/" + iconForCode(current.weather_code);
    weatherIcon.alt = "Weather condition illustration";
    weatherPanel.style.display = "block";
  } catch (error) {
    if (requestId === activeRequest) showError(error.name === "AbortError" ? "Request timed out. Please try again." : "Weather is unavailable. Check your connection and try again.");
  } finally {
    clearTimeout(timeout);
    if (requestId === activeRequest) {
      searchBtn.disabled = false;
      weatherPanel.removeAttribute("aria-busy");
    }
  }
}
searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); checkWeather(searchBox.value); }
});
window.addEventListener("load", () => checkWeather("Kabul"));
