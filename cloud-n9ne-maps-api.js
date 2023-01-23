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
        geocode(address, MAPBOX_API_KEY).then(function (result) {
            // console.log(result);
            const marker = new mapboxgl.Marker(
                {color: '#CC5500',});
            marker.setLngLat(result);
            marker.addTo(map);

            const popup = new mapboxgl.Popup();
            popup.setHTML(`<h3>${address}</h3>`);
            marker.setPopup(popup);

        }).catch(function (error) {
            console.log("Boom");
        });
    }

    // gets the weather at this lat and lon
    function addToMap() {
        $.get('https://api.openweathermap.org/data/2.5/forecast', {
            APPID: OPENWEATHER_API_KEY,
            lat: 30.43937,
            lon: -97.620004,
            units: 'imperial',
        })
            .done(function (weatherData) {
                addMarker('Pflugerville');
                console.log(weatherData);
                //want to do something with the data
                console.log(weatherData.list[0].dt_txt);
                console.log(weatherData.list[0].main.temp);
                console.log(weatherData.list[0].main.feels_like);
                console.log(weatherData.list[0].main.temp_max);
                console.log(weatherData.list[0].main.temp_min);
            });
    }

    addToMap();


    // reverse geocode to get info on lng and lat
    // reverseGeocode({lng: -97.620004, lat: 30.43937}, MAPBOX_API_KEY).then(function(results) {
    //     console.log(results);
    // });
});