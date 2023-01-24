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
                const marker = new mapboxgl.Marker({'color': '#CC5500',});
                marker.setLngLat(result);
                marker.addTo(map);
                map.setZoom(9);
                map.setCenter(result);
                weatherData(result, marker);

            }).catch(function (error) {
            console.log("This location does not exist, please try somewhere else.");
        });
    }

    addMarker("Philadelphia");

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
                `<h3>${weatherData.city.name}</h3>
                <div>Current Conditions: ${weatherData.list[0].weather[0].description}</div>
                <div>Current Temp: ${Math.round(weatherData.list[0].main.temp)}°F</div>
                <div>Feels like: ${Math.round(weatherData.list[0].main.feels_like)}°F</div>
               `
            );
            marker.setPopup(popup);

            //set the weather data to display a 5-day forecast
            var weatherDataHeaderHTML = '';
            weatherDataHeaderHTML = `<h2>${weatherData.city.name} 5-Day Forecast</h2>`;
            $('#weather-table-header').html(weatherDataHeaderHTML);
            var weatherDataDailyHTML = '';
            for (let i = 0; i <= 32; i++) {
                if (i === 0 || i % 8 === 0) {
                weatherDataDailyHTML = `<div>
                <div>
                    <div>Date: ${weatherData.list[i].dt_txt.substring(5, 10)}</div>
                    <div>Conditions: ${weatherData.list[i].weather[0].description}</div>
                    <div>Average Temp: ${Math.round(weatherData.list[i].main.temp)}°F</div>
                </div>
                </div>`
                    $('#weather-table').append(weatherDataDailyHTML)
                }
            }
        });
    }
});