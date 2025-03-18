

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [coordinate_1,coordinate_2], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

const marker1= new mapboxgl.Marker({color:"Blue"})
  .setLngLat([coordinate_1,coordinate_2])
  .setPopup(new mapboxgl.Popup({offset:25})
  .setHTML(`<h5>Exact location provided after booking</h5>`)) 
  .addTo(map);