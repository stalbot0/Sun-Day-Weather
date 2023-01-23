$(document).ready(function() {
    mapboxgl.accessToken = MAPBOX_API_KEY;

    //adds map with center being my home city
    const map = new mapboxgl.Map({
        container: "weather-map",
        style: "mapbox://styles/mapbox/streets-v12",
        zoom: 10,
        center: [-97.620004, 30.43937]
    });

    //adds built-in mapbox zoom btns
    map.addControl(new mapboxgl.NavigationControl());


    // sets marker for pflugerville
    let marker = new mapboxgl.Marker()
        .setLngLat([-97.620004, 30.43937])
        .addTo(map);

    // uses geocoder to log results of input address
    function pinThatAddress(address) {
        geocode(address, MAPBOX_API_KEY).then(function(result) {
            console.log(result);
            const marker = new mapboxgl.Marker();
            marker.setLngLat(result);
            marker.addTo(map);

            const popup = new mapboxgl.Popup();
            popup.setHTML(`<h3>${address}</h3>`);
            marker.setPopup(popup);

        }).catch(function(error) {
            console.log("Boom");
        });
    }
    pinThatAddress("Pflugerville");

    // reverse geocode to get info on lng and lat
    reverseGeocode({lng: -97.620004, lat: 30.43937}, MAPBOX_API_KEY).then(function(results) {
        // logs the address for The Alamo
        console.log(results);
    });

    // marker = new mapboxgl.Marker();
    // marker.setLngLat([-98.4960, 29.5185]);
    // marker.addTo(map);
    //
    // const popup = new mapboxgl.Popup();
    // popup.setHTML("<h3>North Start Mall</h3>");
    // marker.setPopup(popup);

});