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
  let currentDate ="";




  function getWeather(cityName) {
    // Execute a current weather get request from open weather api
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${myAPIKey}`;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
console.log(response);
        todaysWeatherEl.classList.remove("d-none");
        // Parse response to display current weather
        currentDate = moment().format ('D/MM/YYYY'); 
        let day = moment().format("D");
        let month = moment().format("MM");
        let year = moment().format("YYYY");
        nameEl.innerHTML = response.name + " (" + day + "/" + month + "/" + year + ") ";
      //  let weatherIMG = response.main.weather[0].icon;
        //currentIMGEl.setAttribute("src", "https://openweathermap.org/img/wn/" + /*weatherIMG +*/ "@2x.png");
        //currentIMGEl.setAttribute("alt", response.data.weather[0].description);//
        currentTempEl.innerHTML = "Temperature: " + fahrenheitToCelsius(response.main.temp) + " 'C";
        currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
        currentWindEl.innerHTML = "WindSpeed: " + response.wind.speed + " MPH";

        // Get UV Index
        let cityLat = response.coord.lat;
        let cityLon = response.coord.lon;
        let UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${cityLat}&lon=${cityLon}&appid=${myAPIKey}&cnt=1`;
        $.ajax({
          url: UVQueryURL,
          method: "GET"
        }).then(function (response) {
            let UVIndex = document.createElement("span");

            // When UV Index is good, shows green, when ok shows yellow, when bad shows red
            if (response[0].value < 4) {
              UVIndex.setAttribute("class", "badge badge-success");
            }
            else if (response[0].value < 8) {
              UVIndex.setAttribute("class", "badge badge-warning");
            }
            else {
              UVIndex.setAttribute("class", "badge badge-danger");
            }
            console.log(response[0].value)
            UVIndex.innerHTML = response[0].value;
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(UVIndex);
          });

        // Get 5 day forecast for this city
        let cityID = response.id;
        let fiveDayQueryURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${myAPIKey}`;
        $.ajax({
          url: fiveDayQueryURL,
          method: "GET"
        }).then(function (response)  {
            fiveDayEl.classList.remove("d-none");

            //  Parse response to display forecast for next 5 days
            const forecastEls = document.querySelectorAll(".forecast");
            for (i = 0; i < forecastEls.length; i++) {
              forecastEls[i].innerHTML = "";
              const forecastIndex = i * 8 + 4;
              const forecastDate = moment().add(1,'days').format('D/MM/YYYY');
              const forecastDay = moment().add(1,`days`).format("D");;
              const forecastMonth = moment().format("MM");
              const forecastYear = moment().format("YYYY");
              const forecastDateEl = document.createElement("p");
              $("forecastDate").attr("class", "mt-3 mb-0 forecast-date");
              forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
              forecastEls[i].append(forecastDateEl);

              // Icon for current weather
              const forecastWeatherEl = document.createElement("img");
              $("forecastDate").attr("src", "https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
              $("forecastDate").attr("alt", response.list[forecastIndex].weather[0].description);
              forecastEls[i].append(forecastWeatherEl);
              const forecastTempEl = document.createElement("p");
              forecastTempEl.innerHTML = "Temp: " + fahrenheitToCelsius(response.list[forecastIndex].main.temp) + " &#176F";
              forecastEls[i].append(forecastTempEl);
              const forecastHumidityEl = document.createElement("p");
              forecastHumidityEl.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
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

  function fahrenheitToCelsius(f) {
    return Math.floor((f - 32) * 5/9);
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
