mapboxgl.accessToken = "pk.eyJ1IjoiY2Fyb2xpbmVuZWUiLCJhIjoiY201b2RhZmxtMGthajJucHRxcW5heGxiNyJ9.NMKAQoQvhYJ8RQq0NQuYkA";
const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/carolinenee/cm7uuha4i01rf01qo19chh4m6', // monochromatic basemap style 
    center: [-79.39, 43.66], // starting position [lng, lat] of toronto
    zoom: 13, // starting zoom
});


map.on('load', () => {
    // Add your GeoJSON source
    map.addSource('food_data', { //loading geojson cafe data made with geojson.io 
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/Food%20Services%20Locations%20and%20Day_Time%20Filters.geojson' // link to git hub raw data file
    });
    // Add a layer for the locations
    map.addLayer({
      id: 'locations-layer',
      type: 'circle',
      source: 'food_data',
      paint: {
        'circle-radius': 5,
        'circle-color': '#FF0000'
      }
    });
  });

  // Function to filter by day
  function filterByDay(day) {
    map.setFilter('locations-layer', ['==', ['get', day], 1]);
  }
