$(document).ready(function() {
    mapboxgl.accessToken = MAPBOX_API_KEY;

    const map = new mapboxgl.Map({
        container: "my-map",
        style: "mapbox://styles/mapbox/streets-v12",
        zoom: 10,
        center: [-97.743676, 30.269374]
    });



    let marker = new mapboxgl.Marker()
        .setLngLat([-97.743676, 30.269374])
        .addTo(map);

    // find out where north star mall is and make a marker and popup for it
    // the  geocode method from mapbox-geocoder-utils.js

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

    pinThatAddress("Perry's Steakhouse");

    // reverse geocode method from mapbox-geocoder-utils.js
    reverseGeocode({lng: -97.743676, lat: 30.269372}, MAPBOX_API_KEY).then(function(results) {
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