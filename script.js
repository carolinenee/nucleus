mapboxgl.accessToken = "pk.eyJ1IjoiY2Fyb2xpbmVuZWUiLCJhIjoiY201b2RhZmxtMGthajJucHRxcW5heGxiNyJ9.NMKAQoQvhYJ8RQq0NQuYkA"; // token to use mapbox API 
const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/mapbox/standard', // standard mapbox style 
    center: [-79.7018518888638, 43.668552107715904], // starting position [lng, lat] of peel
    zoom: 9, // starting zoom
});

map.on('load', () => {
  
  //loading food program data
  map.addSource('food_data', { 
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/Food%20Services%20Locations%20and%20Day_Time%20Filters.geojson' // link to git hub raw data file
  });

  //adding the food program data to the map 
  map.addLayer({
    id: 'locations-layer',
    type: 'circle',
    source: 'food_data',
    paint: {
      'circle-radius': 5,
      'circle-color': '#000000'
    }
  });

  document.querySelectorAll('#filters button').forEach(button => {
    button.addEventListener('click', () => {
      const selectedDay = button.getAttribute('data-day');
      filterByDays([selectedDay]); // Pass the selected day as an array
    });
  });
});

function filterByDays(days) {
  const filterConditions = ['all']; // Start with an "and" condition
  days.forEach(day => {
    filterConditions.push(['==', ['get', day], 1]);
  });
  map.setFilter('locations-layer', filterConditions);
}
