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

    addMarker("San Antonio, TX");

    // function addPopUp(address, marker, weatherData) {
    //     const popup = new mapboxgl.Popup();
    //     // popup.setHTML(`${address}`); we want to set the DOM and the HTML in the weather data output
    //     marker.setPopup(popup);
    // }

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
               `
            );
            marker.setPopup(popup);


            for (let i = 0; i <= 32; i++) {
                var weatherDataDaily = '';
                if (i === 0 || i % 8 === 0) {
                    weatherDataDaily = `<div>
                <h2>${weatherData.city.name} 5-Day Forecast</h2>
                <hr>
                <div>
                    <div>Date: ${weatherData.list[0].dt_txt.substring(5, 10)}</div>
                    <div>Temp: ${Math.round(weatherData.list[0].main.temp)}</div>
                    <div>Feels like: ${Math.round(weatherData.list[0].main.feels_like)}</div>
                    <div>Current Conditions: ${weatherData.list[0].weather[0].description}</div>
                    <div>Max Temp ${Math.round(weatherData.list[0].main.temp_max)}</div>
                    <div>Min Temp ${Math.round(weatherData.list[0].main.temp_min)}</div>
                </div>
                </div>`
                    $('#weather-table').html(weatherDataDaily)
                }
                if (i % 8 !== 0) {
                    // alert('invalid input');
                }
            }


            //want to do something with the data
            // console.log(weatherData.list[0].dt_txt);
            // console.log(weatherData.list[0].main.temp);
            // console.log(weatherData.list[0].main.feels_like);
            // console.log(weatherData.list[0].main.temp_max);
            // console.log(weatherData.list[0].main.temp_min);
            // console.log(weatherData.list[0].weather[0].conditions);
        });
    }


    // reverse geocode to get info on lng and lat
    // reverseGeocode({lng: -97.620004, lat: 30.43937}, MAPBOX_API_KEY).then(function(results) {
    //     console.log(results);
    // });
});