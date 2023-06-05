document.addEventListener("DOMContentLoaded", function() {
    mapboxgl.accessToken = MAPBOX_API_KEY;

    //adds map with starting center point position
    const map = new mapboxgl.Map({
        container: "weather-map",
        style: "mapbox://styles/mapbox/outdoors-v12",
        zoom: 0,
        center: [-97.620004, 30.43937]
    });

    //adds built-in mapbox zoom-btns
    map.addControl(new mapboxgl.NavigationControl());

    //adds built-in geolocator onto the map itself with position options
    var geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    });

    //adds the geolocator on the map which sets a marker for the users current location if they accept
    map.addControl(geolocateControl);
    geolocateControl.on("geolocate", function (e) {
        var longitude = e.coords.longitude;
        var latitude = e.coords.latitude
        var result = [longitude, latitude];
        const marker = new mapboxgl.Marker({'color': 'rgba(0,102,255,0.38)',});
        marker.setLngLat(result);
        marker.addTo(map);
        map.setZoom(8);
        map.setCenter(result);
        weatherData(result, marker);
    })


    // function uses geocoder to log result and pin input address
    function addMarker(address) {
        geocode(address, MAPBOX_API_KEY)
            .then(function (result) {
                console.log(result);
                const marker = new mapboxgl.Marker({'color': 'rgba(255,0,21,0.65)',});
                marker.setLngLat(result);
                marker.addTo(map);
                map.setZoom(13);
                map.setCenter(result);

                // this function is called to use the result and the marker in teh weather data function in order to display the html
                weatherData(result, marker);
                $('#invalid-feedback').html("");

            }).catch(function (error) {
            console.log("This location does not exist, please try a different location.");
            var errorHTML = '';
            errorHTML = `<div class="control-group error w-50 mx-auto">
                            <div class="p-0 my-0 mx-auto text-decoration-underline bg-danger rounded-2">Invalid input</div>
                        </div>`
            $('#invalid-feedback').html(errorHTML);
        });
    }

    // gets the weather at this lat and lon and adds all the data to the html
    function weatherData(result, marker) {
        // console.log(result);
        $.get('https://api.openweathermap.org/data/2.5/forecast', {
            APPID: OPENWEATHER_API_KEY,
            lat: result[1],
            lon: result[0],
            units: 'imperial',
        }).done(function (weatherData) {
            console.log(weatherData);

            // set the popup data for the
            const popup = new mapboxgl.Popup();
            popup.setHTML(`<h3 class="text-center fraunces-font">${weatherData.city.name}</h3>
                <hr>
                <div class="text-center cambay-font">Current Conditions: ${upperCase(weatherData.list[0].weather[0].description)}</div>
                <div class="text-center cambay-font">Current Temp: ${Math.round(weatherData.list[0].main.temp)}°F</div>
                <div class="text-center cambay-font">Feels like: ${Math.round(weatherData.list[0].main.feels_like)}°F</div>`);
            marker.setPopup(popup);

            //set the weather data to display a 5-day forecast HEADER, changing the html each time the search is done
            var weatherDataHeaderHTML = '';
            weatherDataHeaderHTML = `<div class="m-auto"><h2 class="five-day-forecast fraunces-font fs-1">${weatherData.city.name} 5-Day Forecast</h2><hr class="w-75 m-auto my-1">
                                    <p class="text-center cambay-font fs-5">Current Conditions: ${upperCase(weatherData.list[0].weather[0].description)}</p>
                                    <p class="text-center cambay-font fs-5">Current Temp: ${Math.round(weatherData.list[0].main.temp)}°F</p>
                                    <p class="text-center cambay-font fs-5">Feels like: ${Math.round(weatherData.list[0].main.feels_like)}°F</p></div>`;
            $('#weather-table-header').html(weatherDataHeaderHTML);
            $("#weather-table").html("");

            // created variable that would append to the html with the 5-day forecase once conditions are met
            //used modulus 8 due to the API keys being restricted to 3 hour intervals for each index in the object array
            var weatherDataDailyHTML = '';
            for (let i = 0; i <= 32; i++) {
                if (i === 0 || i % 8 === 0) {
                    let date = new Date(weatherData.list[i].dt_txt);
                    //console.log(date);
                    weatherDataDailyHTML =
                        `<div>
                             <div class="container m-3 individual-weather-day weather-info-container animated-weather-card">
                                <div class="cambay-font fs-6 mt-3">${date.toDateString().substring(0, 3)}, ${date.toDateString().substring(4, 7)} ${date.toDateString().substring(8, 10)}</div> 
                                <hr class="m-0">    
                                <div><img src="https://openweathermap.org/img/wn/${weatherData.list[i].weather[0].icon}@2x.png"></div>                
                                <div class="cambay-font fs-6">${upperCase(weatherData.list[i].weather[0].description)}</div>
                                <div class="cambay-font fs-6">Average Temp: ${Math.round(weatherData.list[i].main.temp)}°F</div>
                                <div class="text-center cambay-font fs-6">Humidity: ${Math.round(weatherData.list[i].main.humidity)}%</div>
                            </div>
                        </div>`
                    $('#weather-table').append(weatherDataDailyHTML);
                }
            }
        });
    }

    //sets default to any city
    addMarker("New York");

    //adding search bar functionality
    function weatherLocationSearch(e) {
        e.preventDefault();
        let userLocationSearch = $("#search-location-weather");
        let newLocationSearch = (userLocationSearch.focus().val());
        addMarker(newLocationSearch);
    }

    $("#search-btn").click(weatherLocationSearch);

    //stolen function used to make the conditions uppercase from the weather data
    function upperCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

// // setting the gif to display when window is loading
//     var loadingGif = $(".loading-gif").style
//     loadingGif.backgroundImage = "url('loading-gif.gif')";
//     loadingGif.display = "none";
//e
//     window.onload = function () {
//         loadingGif.display = "block";
//     };
//
//     document.addEventListener("DOMContentLoaded", function () {
//         loadingGif.display = "none";
//     });

});