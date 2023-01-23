$(document).ready(function() {
    mapboxgl.accessToken = MAPBOX_API_KEY;

    //adds map with center being my home city
    const map = new mapboxgl.Map({
        container: "weather-map",
        style: "mapbox://styles/mapbox/outdoors-v12",
        zoom: 0,
        center: [-97.620004, 30.43937]
    });

    //adds built-in mapbox zoom btns
    map.addControl(new mapboxgl.NavigationControl());

    // uses geocoder to log results of input address
    function pinThatAddress(address) {
        geocode(address, MAPBOX_API_KEY).then(function(result) {
            console.log(result);
            const marker = new mapboxgl.Marker(
                { color: '#CC5500',});
            marker.setLngLat(result);
            marker.addTo(map);

            const popup = new mapboxgl.Popup();
            popup.setHTML(`<h3>${address}</h3>`);
            marker.setPopup(popup);

        }).catch(function(error) {
            console.log("Boom");
        });
    }
    // pinThatAddress("Pflugerville")


    // reverse geocode to get info on lng and lat
    // reverseGeocode({lng: -97.620004, lat: 30.43937}, MAPBOX_API_KEY).then(function(results) {
    //     console.log(results);
    // });
});