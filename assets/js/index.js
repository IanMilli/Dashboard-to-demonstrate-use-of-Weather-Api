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
  
    
  