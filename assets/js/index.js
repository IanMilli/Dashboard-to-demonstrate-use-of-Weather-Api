/* create a function that begins as soon as the page is opened. Previously i have used window.onload but that is better if using javascript to define the page
 structure, for a page where the file structure is in majority constructed in index.html use $(document).ready */

$(document).ready(function () {
  /**use the top area of the function to define the required variables*/

  /**create myAPIKey variable to equal the unique created API key from openweathermap.org */
  let myAPIKey = "92d535d06ad57d90e707465ad6f59b22";
  /**create variable cityEl to store city names retrieved by getting the value of the element(the input box) with the id of inputCity*/
  let cityEl = document.getElementById("inputCity");
  /**create variable searchEl to store ...........retrieved by getting the value of the element(the input box) with the id of searchBtn*/
  let searchEl = document.getElementById("searchBtn");

  let clearEl = document.getElementById("clearSearch");

  let nameEl = document.getElementById("cityName");

  let currentIMGEl = document.getElementById("currentIMG");

  let currentTempEl = document.getElementById("temperature");

  let currentHumidityEl = document.getElementById("humidity");

  let currentWindEl = document.getElementById("windSpeed");

  let currentUVEl = document.getElementById("UVIndex");

  let historyEl = document.getElementById("history");

  let fiveDayEl = document.getElementById("fiveDay");

  let todaysWeatherEl = document.getElementById("todaysWeather");

  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];




  function getWeather(cityName) {
    // Execute a current weather get request from open weather api
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${myAPIKey}`;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

        todaysWeatherEl.classList.remove("d-none");
        // Parse response to display current weather
        const currentDate = new Date(response.data.dt * 1000);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        nameEl.innerHTML = response.data.name + " (" + day + "/" + month + "/" + year + ") ";
        let weatherIMG = response.data.weather[0].icon;
        currentIMGEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIMG + "@2x.png");
        currentIMGEl.setAttribute("alt", response.data.weather[0].description);
        currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
        currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        currentWindEl.innerHTML = "WindSpeed: " + response.data.wind.speed + " MPH";

        // Get UV Index
        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + myAPIKey + "&cnt=1";
        axios.get(UVQueryURL)
          .then(function (response) {
            let UVIndex = document.createElement("span");

            // When UV Index is good, shows green, when ok shows yellow, when bad shows red
            if (response.data[0].value < 4) {
              UVIndex.setAttribute("class", "badge badge-success");
            }
            else if (response.data[0].value < 8) {
              UVIndex.setAttribute("class", "badge badge-warning");
            }
            else {
              UVIndex.setAttribute("class", "badge badge-danger");
            }
            console.log(response.data[0].value)
            UVIndex.innerHTML = response.data[0].value;
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(UVIndex);
          });

        // Get 5 day forecast for this city
        let cityID = response.data.id;
        let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + MYAPIKey;
        axios.get(forecastQueryURL)
          .then(function (response) {
            fiveDayEl.classList.remove("d-none");

            //  Parse response to display forecast for next 5 days
            const forecastEls = document.querySelectorAll(".forecast");
            for (i = 0; i < forecastEls.length; i++) {
              forecastEls[i].innerHTML = "";
              const forecastIndex = i * 8 + 4;
              const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
              const forecastDay = forecastDate.getDate();
              const forecastMonth = forecastDate.getMonth() + 1;
              const forecastYear = forecastDate.getFullYear();
              const forecastDateEl = document.createElement("p");
              forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
              forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
              forecastEls[i].append(forecastDateEl);

              // Icon for current weather
              const forecastWeatherEl = document.createElement("img");
              forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
              forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
              forecastEls[i].append(forecastWeatherEl);
              const forecastTempEl = document.createElement("p");
              forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
              forecastEls[i].append(forecastTempEl);
              const forecastHumidityEl = document.createElement("p");
              forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
              forecastEls[i].append(forecastHumidityEl);
            }
          })
      });
  }

  // Get history from local storage if any
  searchEl.addEventListener("click", function () {
    const searchTerm = cityEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  })

  // Clear History button
  clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
  })

  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-white");
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function () {
        getWeather(historyItem.value);
      })
      historyEl.append(historyItem);
    }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }

})
