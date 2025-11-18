const API_KEY = "e44659474b4bacbbb7bdc1465ccc5ecf";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const weatherIconEl = document.getElementById("weatherIcon");
const forecastEl = document.getElementById("forecast");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

async function getWeather(city) {
    const encodedCity = encodeURIComponent(city);

    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodedCity}&limit=1&appid=${API_KEY}`;
    const geoData = await fetch(geoURL).then(res => res.json());

    if (!geoData.length) {
        alert("City not found");
        return;
    }

    const { lat, lon, name } = geoData[0];

    const weatherURL = `
        https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
    `;

    const weatherData = await fetch(weatherURL).then(res => res.json());

    // Current Weather
    const current = weatherData.list[0];
    cityNameEl.textContent = name;
    tempEl.textContent = Math.round(current.main.temp) + "°C";
    descEl.textContent = current.weather[0].description;
    humidityEl.textContent = "Humidity: " + current.main.humidity + "%";
    windEl.textContent = "Wind: " + current.wind.speed + " m/s";
    weatherIconEl.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

    // 5-Day Forecast
    forecastEl.innerHTML = "";

    for (let i = 0; i < weatherData.list.length; i += 8) {
        const day = weatherData.list[i];
        const div = document.createElement("div");
        div.classList.add("day");
        div.innerHTML = `
            <h4>${new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}</h4>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" width="40">
            <p>${Math.round(day.main.temp)}°C</p>
        `;
        forecastEl.appendChild(div);
    }
}
