/* create a function that begins as soon as the page is opened. Previously i have used window.onload but that is better if using javascript to define the page
 structure, for a page where the file structure is in majority constructed in index.html use $(document).ready */

$(document).ready(function () {
    /**use the top area of the function to define the required variables*/

    /**create myAPIKey variable to equal the unique created API key from openweathermap.org */
    let myAPIKey = "92d535d06ad57d90e707465ad6f59b22";
    /**create variable city to store city names under */
    let city;
    /**create variable weatherID  */
    let weatherId;
    /**create variable weather */
    let weather;
    /**create variable cityLat to store latitude data under */
    let cityLat;
     /**create variable cityLat to store longitude data under */
    let cityLon;
    /**create variable uvIndex to store uv data in a string */
    let uvIndex = "";
    /** */
    let uv;
    /** create an array under the variable savedCities*/
    let savedCities= [];
  

 

    /**create a listening event for the search button being clicked */
    $("#searchBtn").on("click", function () {
        /**use event.preventDefault() to stop the default response to a button click and to instead obey the following if statement */
        event.preventDefault();
        /**  Search for a city on click that has the same value as that entered by the user
         by creating the following if statement where we state that if the value of the input box with the id inputCity is not equal to a string then...
         */
        if ($("#inputCity").val() !== "") {
/** ......make the empty variable city equal to the text value of the input box with the id inputCity, use . trim to remove any excess spaces the user inputs  
 * and run a function to get todays weather.
*/
          city = $("#inputCity").val().trim();
        }
        getToday();
      });
    
      /** add buttons for each city in the past searches so that the user can click on them to get the weather data for them without
       * having to re search the cities name using the following function addCity */ 
      function addCity() {
        $("#pastSearches").prepend($("<button>").attr("type", "button").attr("cityInfo", city).addClass("past text-muted list-group-item list-group-item-action bg-primary").text(city));
        $("inputCity").val("");
      }

/*Create a listening event for if someone clicks on one of the buttons created to display previously searched cities  */

$("#pastSearches").on("click",".past",function () {
     /**use event.preventDefault() to stop the default response to a button click and to instead obey the following if statement */
    event.preventDefault();
    /**let city in this function = the buttons connected to the id pastSearches plus the attribute cityInfo */
    city = $(this).attr("cityInfo");
    /**run the function getToday to get todays weather data for the requested past search city */
    getToday();
  });

/**create a function to see if the city has already been searched for to prevent duplicate buttons from happening */
function checkDuplicateCities () {
    if ( $(`#past-searches button[data-city="${city}"]`).length ) { 
      $("#search").val("");
    } else {
      addCity();
      savedCities.push(city);
      localStorage.setItem("cities", JSON.stringify(savedCities))
    }
  }

/*get todays weather information from openweathermap.org using the following function*/

function getToday() {
  let apiCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIKey}&units=imperial`;

  $.ajax({
    url: apiCurrentWeather,
    method: "GET",
    error: function () {
      alert("City not found. Please check spelling and search again.");
      $("#search").val("");
    }
  }).then(function (response) {
    checkDuplicateCities();
    weatherId = response.weather[0].id;
    decodeWeatherId();

    $("#city").text(response.name);
    $("#temp").text(`${response.main.temp} °C`);
    $("#humidity").text(`${response.main.humidity} %`);
    $("#wind").text(`${response.wind.speed} MPH`);
    $("#today-img").attr("src", `./Assets/${weather}.png`).attr("alt", weather);

    cityLat = response.coord.lat;
    cityLon = response.coord.lon;

    getUV();
    getFiveDay();
  });
}
 /**create a function to retrieve required UV info */
 function getUV() {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/uvi?appid=${myAPIKey}&lat=${cityLat}&lon=${cityLon}`,
    method: "GET"
  }).then(function (response) {
    uvIndex = response.value;
    decodeUV();
    $("#uv").text(uvIndex).css("background-color", uv);
  })
}

function getFiveDay() {
  let apiFive = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,minutely,current&appid=${myAPIKey}&units=metric`
  $.ajax({
    url: apiFive,
    method: "GET"
  }).then(function (response) {
    for (var i = 0; i < 5; i++) {
      var unixTime = response.daily[i].dt
      $(`#day${i}`).text(moment.unix(unixTime).format('l'))
      $(`#temp${i}`).text(`${response.daily[i].temp.day} °C`);
      $(`#hum${i}`).text(`${response.daily[i].humidity} %`);
      weatherId = response.daily[i].weather[0].id
      decodeWeatherId();
      $(`#img${i}`).attr("src", `./Assets/${weather}.png`).attr("alt", weather)
    }
  })
}
// WEATHER DECODERS -----------------------------------------------------------------------

// Change img for weather 
function decodeWeatherId() {
  switch (true) {
    case (weatherId > 199 && weatherId < 299):
      weather = "Thunderstorm";
      break;
    case (weatherId > 299 && weatherId < 599):
      weather = "Rain";
      break;
    case (weatherId > 599 && weatherId < 699):
      weather = "Snow";
      break;
    case (weatherId > 699 && weatherId < 799):
      weather = "Atmostphere";
      break;
    case weatherId === 800:
      weather = "Clear";
      break;
    case weatherId > 800:
      weather = "Clouds"
  }
}

function decodeUV() {
  uv = "";
  switch (true) {
    case (uvIndex >= 0 && uvIndex < 3):
      uv = "green";
      break;
    case (uvIndex >= 3 && uvIndex < 6):
      uv = "darkkhaki";
      break;
    case (uvIndex >= 6 && uvIndex < 8):
      uv = "orange";
      break;
    case (uvIndex >= 8 && uvIndex < 11):
      uv = "red";
      break;
    case (uvIndex >= 11):
      uv = "violet"
  }
}

 // Load Cities
 function loadCities() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
      savedCities = storedCities;
      renderCities();
    } else {
      city = "San Diego"
      checkPast();
    }
  }

  function renderCities() {
    for (var i = 0; i < savedCities.length; i++) {
      city = savedCities[i];
      addCity();
    }
  }

  // Clear Storage 

  $("#clear").on("click", function () {
    localStorage.clear();
    savedCities = [];
    $("#past-searches").empty();
    city = "San Diego";
    init();
  })

  // INIT -----------------------------------------------------------------------

  // Initialize with SD
  function init() {
    getToday();
  }

});