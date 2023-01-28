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














    })
  