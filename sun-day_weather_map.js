$(document).ready(function () {
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

    // function uses geocoder to log result and pin input address
    function addMarker(address) {
        geocode(address, MAPBOX_API_KEY)
            .then(function (result) {
                const marker = new mapboxgl.Marker({'color': '#ffae00',});
                marker.setLngLat(result);
                marker.addTo(map);
                map.setZoom(9);
                map.setCenter(result);
                weatherData(result, marker);

            }).catch(function (error) {
            console.log("This location does not exist, please try somewhere else.");
        });
    }

    // gets the weather at this lat and lon
    function weatherData(result, marker) {
        // console.log(result);
        $.get('https://api.openweathermap.org/data/2.5/forecast', {
            APPID: OPENWEATHER_API_KEY,
            lat: result[1],
            lon: result[0],
            units: 'imperial',
        }).done(function (weatherData) {
            console.log(weatherData);

            // set the popup data
            const popup = new mapboxgl.Popup();
            popup.setHTML(
                `<h3 class="text-center">${weatherData.city.name}</h3>
                <hr>
                <div class="text-center">Current Conditions: ${weatherData.list[0].weather[0].description}</div>
                <div class="text-center">Current Temp: ${Math.round(weatherData.list[0].main.temp)}°F</div>
                <div class="text-center">Feels like: ${Math.round(weatherData.list[0].main.feels_like)}°F</div>
               `
            );
            marker.setPopup(popup);

            //set the weather data to display a 5-day forecast
            var weatherDataHeaderHTML = '';
            weatherDataHeaderHTML = `<div class="m-auto"><h2 class="five-day-forecast fraunces-font fs-1">${weatherData.city.name} 5-Day Forecast</h2><hr class="w-75 m-auto my-1">
                                    <p class="text-center">Current Conditions: ${upperCase(weatherData.list[0].weather[0].description)}</p>
                                    <p class="text-center">Current Temp: ${Math.round(weatherData.list[0].main.temp)}°F</p>
                                    <p class="text-center">Feels like: ${Math.round(weatherData.list[0].main.feels_like)}°F</p></div>`;
            $('#weather-table-header').html(weatherDataHeaderHTML);
            $("#weather-table").html("");

            var weatherDataDailyHTML = '';
            for (let i = 0; i <= 32; i++) {
                if (i === 0 || i % 8 === 0) {
                    let date = new Date(weatherData.list[i].dt_txt);
                    //console.log(date);
                    weatherDataDailyHTML =
                        `<div>
                             <div class="container m-3 individual-weather-day weather-info-container">
                                <div class="cambay-font fs-6 mt-3">${date.toDateString().substring(0, 3)}, ${date.toDateString().substring(4, 7)} ${date.toDateString().substring(8, 10)}</div> 
                                <hr>    
                                <div><img src="https://openweathermap.org/img/wn/${weatherData.list[i].weather[0].icon}@2x.png"></div>                
                                <div class="cambay-font fs-6">Conditions: ${upperCase(weatherData.list[i].weather[0].description)}</div>
                                <div class="cambay-font fs-6">Average Temp: ${Math.round(weatherData.list[i].main.temp)}°F</div>
                                <div class="text-center cambay-font fs-6">Humidity: ${Math.round(weatherData.list[0].main.humidity)}%</div>
                            </div>
                        </div>`
                    $('#weather-table').append(weatherDataDailyHTML);
                }
            }
        });
    }

    //sets default to San Antonio
    addMarker("San Antonio");

    //adding search bar functionality
    function weatherLocationSearch(e) {
        e.preventDefault();
        let userLocationSearch = $("#search-location-weather");
        let newLocationSearch = userLocationSearch.focus().val()
        addMarker(newLocationSearch);
    }

    $("#search-btn").click(weatherLocationSearch);

    //stolen function used to make the conditions uppercase from the weather data
    function upperCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
});