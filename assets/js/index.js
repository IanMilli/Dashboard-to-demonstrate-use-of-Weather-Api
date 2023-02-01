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

  let currentPressureEl = document.getElementById("pressure");

  let currentHumidityEl = document.getElementById("humidity");

  let currentWindEl = document.getElementById("windSpeed");

  let currentUVEl = document.getElementById("UVIndex");

  let historyEl = document.getElementById("history");

  let fiveDayEl = document.getElementById("fiveDay");

  let todaysWeatherEl = document.getElementById("todaysWeather");

  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  /**let current Date equal an empty string so we can use the variable later */
  let currentDate = "";
  /*use the variable currentSayTime Text to equal a h2 element to give the text basic formatting*/
  let currentDayTimeText = $("<h2>");
  /**use the variable currentSayTime to equal the class of currentDayTime so the time will be printed in the correct place on the page */
  let currentDayTime = $(".currentDayTime");

  /** create a function that will display the current date and time for the user */
  setInterval(
    function () {
      currentDayTimeText.text(moment().format("dddd, MMMM Do, YYYY H:mm:ss a"));
      currentDayTime.append(currentDayTimeText);

    }, 1000);

  /**create function to get the weather relating to a particular city name */
  function getWeather(cityName) {
    /*Execute a current weather get request from openweathermap.org using the ajax approach
    first make the variable queryURL equal the url address for the api specifiying that the request is based on the cities name and includes the apiKey generated for the app*/
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${myAPIKey}`;
    /**call the ajax function to follow the url specified in the variable queryURL and "get" the information which comes as a 'response'
     * then run a function based on the response array created by the request.
     */
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      /**console log the response to understand what information you have got back from the api server following the request to it.
       * so basically we have asked for info, we have been sent info based on our specific request and now we can have a look at that answer
       */
      console.log(response);
      /* remove the class of d-none from the element todaysWeather to reveal the card coded to contain todays weather for the selected city*/
      todaysWeatherEl.classList.remove("d-none");
      /*Parse response to display current weather*/
      /** redefine current date by using the moments library to seek the required information */
      currentDate = moment().format('D/MM/YYYY');
      /**make day = to the current day as per the moments library */
      let day = moment().format("D");
      /**make month = to the current month as per the moments library */
      let month = moment().format("MM");
      /**make year = to the current year as per the moments library */
      let year = moment().format("YYYY");
      /**setting the date in the correct order for uk approach add the correct date with the city name if a response is received for said city inputed by the user */
      nameEl.innerHTML = response.name + " (" + day + "/" + month + "/" + year + ") ";
      /**display the weather image received from the api request  by doing the following:*/
      /**let weather image equal the icon code received in the api request */
      let weatherIMG = response.weather[0].icon;
      /**add the attribute to currentIMGE1 of the picture located at the url below that has the code equal to the value of weatherImg and is sized to 2x.png */
      currentIMGEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIMG + "@2x.png");
      /**add the attribute of the weather description for the requested weather icon as the alt in case the image does not display */
      currentIMGEl.setAttribute("alt", response.weather[0].description);

      /**to print the temperature for the city add html to the currentTemp element that includes the word temperature, the response from the api request(once it has been converted to celsius using a separate function) and the correct unit describer - 'C */
      currentTempEl.innerHTML = "Temperature: " + fahrenheitToCelsius(response.main.temp) + " 'C";
      /**to print the pressure for the city add html to the currentPressure element that includes the word pressure, the response from the api request and the correct unit describer - mbar */
      currentPressureEl.innerHTML = "Pressure: " + response.main.pressure + " mbar";
      /**to print the humidity for the city add html to the currentHumidity element that includes the word humidity, the response from the api request and the correct unit describer - % */
      currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
      /**to print the wind speed for the city add html to the currentWind element that includes the words wind speed, the response from the api request and the correct unit describer - MPH */
      currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";

     /**get the UV INDEX for the selected city and display accordingly 
      * For this we will need to know the cities latitude and longitude
     */
    /**make cityLat equal the latitude of the city as per the response from the api */
      let cityLat = response.coord.lat;
      /**make cityLon equal the longitude of the city as per the response from the api */
      let cityLon = response.coord.lon;
      /**send a new enquiry to the api based on the cities latitude and longitude and including our api key to authorise the request then use the ajax functiion */
      let UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${cityLat}&lon=${cityLon}&appid=${myAPIKey}&cnt=1`;
      $.ajax({
        url: UVQueryURL,
        method: "GET"
      }).then(function (response) {
        /**parse the reponse from the api to get the correct uv reading for the city */
        /**make UVIndex equal to craeted html span element  */
        let UVIndex = document.createElement("span");

        /* When the UV Index is good, show green, when ok show yellow, when bad show red by doing the following:
        use an if statement to add the class badge-success (green in bootstrap) to the element if the uv value is less than 4*/
        if (response[0].value < 4) {
          UVIndex.setAttribute("class", "badge badge-success");
        }
        /**use a else if statement if the response is less than 8 (remember this will be overridden by the if statement if the value is less than
         * 4, to add the class badge-warning to the span element(bootstrap class = yellow)) */
        else if (response[0].value < 8) {
          UVIndex.setAttribute("class", "badge badge-warning");
        }
        /**use a else statement if the response is anything else (remember this will be overridden by the else if statement if value less than 8 or the if statement if the value is less than
         * 4, to add the class badge-danger to the span element(bootstrap class = red))*/
        else {
          UVIndex.setAttribute("class", "badge badge-danger");
        }
        /**console log the response for value- the uv value */
        console.log(response[0].value)
        /**add the value of value to the variable UVIndex */
        UVIndex.innerHTML = response[0].value;
        /*add the text uv Index to currentUV element */
        currentUVEl.innerHTML = "UV Index: ";
        /**append the variable to the currentUV element so the current uv rating will be displayed */
        currentUVEl.append(UVIndex);
      });

      /**get the five day forecast for the requested city */
      /**make the variable cityID equal the id received in the response from the api that connects to the city the user has requested */
      let cityID = response.id;
      /**send a query to the api based on the city id value and including the api key to authorize the request using the ajax function*/
      let fiveDayQueryURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${myAPIKey}`;
      $.ajax({
        url: fiveDayQueryURL,
        method: "GET"
      }).then(function (response) {
        /*remove the d-none class from the five days element to reveal the cards to display the next five days of information in*/
        fiveDayEl.classList.remove("d-none");

        /*  Parse the api response to display the forecast for the next 5 days using a for loop*/

      let forecastEls = document.querySelectorAll(".forecast");
/**set the for loop to have a length between 0 and 6 (have attempted to adjust i to start at 1 (next days info after current day (tomorrow) but my functions did not like it so had 
 * to revert to using [i+1] throughout to get the information i needed) */
        for (i = 0; i < 6; i++) {
          forecastEls[i].innerHTML = "";
          forecastDate = moment().add([i + 1], 'days').format('D/MM/YYYY');
          let forecastDateEl = document.createElement("p");
          $("forecastDate").attr("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML = forecastDate;
          forecastEls[i].append(forecastDateEl);

          /**get the weather icon for each day */
          let forecastWeatherEl = document.createElement("img");
          forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.list[i + 1].weather[0].icon + "@2x.png");
          forecastWeatherEl.setAttribute("alt", response.list[i + 1].weather[0].description);
          forecastEls[i].append(forecastWeatherEl);
/**get the temp for each day */
          let forecastTempMinEl = document.createElement("p");
          let fTemp = kelvinToCelsius(response.list[i + 1].main.temp);
          console.log("data list for min temp", response.list[i + 1].main.temp);
          console.log("Temp = ", fTemp);
          forecastTempMinEl.innerHTML = "Temperature: " + fTemp + " 'C";
          forecastEls[i].append(forecastTempMinEl);
/**get the pressure for each day */
          let forecastPressureEl = document.createElement("p");
          forecastPressureEl.innerHTML = "Pressure: " + response.list[i + 1].main.pressure + "  mbar";
          forecastEls[i].append(forecastPressureEl);
/**get the humidity for each day */
          let forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.innerHTML = "Humidity: " + response.list[i + 1].main.humidity + "  %";
          forecastEls[i].append(forecastHumidityEl);
/** get the wind speed for each day */
          let forecastWindEl = document.createElement("p");
          forecastWindEl.innerHTML = "Wind: " + response.list[i + 1].wind.speed + "  MPH";
          forecastEls[i].append(forecastWindEl);

        }
      })
    });
  }
/**this ends the big giant function that operates on page load */

  /* create a event listener for when the user clicks on the search Cities button*/
  searchEl.addEventListener("click", function () {
    let searchTerm = cityEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  })

  /* create an event listener for when the user clicks on the clear search history button*/ 
  clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
/**use window.location.reload to reset the page and ensure the page knows local storage is cleared */
    window.location.reload();
  })
/**use this function to convert from fahrenheit to celsius */
  function fahrenheitToCelsius(f) {
    return Math.floor((f - 32) * 5 / 9);
  }
  /**use this function to convert from kelvin to celsius */
  function kelvinToCelsius(k) {
    return Math.floor(k - 273.15);
  }
/** create function to render the search history */
  function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "button");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-primary mb-1 text-white text-center");
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
