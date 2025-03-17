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


  //loading walk polygons data for all food programs
  map.addSource('walk_data', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/TRIAL.geojson'
  });

  map.addLayer({
    id: 'walk_data',
    type: 'fill',
    source: 'walk_data',
    paint: {
      'fill-opacity': 0.66
    }
  });

  map.addSource('walk_da_data', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/TRIALda.geojson'
  });

  map.addLayer({
    id: 'walk_da_data',
    type: 'fill',
    source: 'walk_da_data',
    paint: {
      'fill-opacity': 0.66
    }
  });

  map.addSource('pt_data', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/TRIALpt.geojson'
  });

  map.addLayer({
    id: 'pt_data',
    type: 'fill',
    source: 'pt_data',
    paint: {
      'fill-opacity': 0.66
    }
  });

  map.addSource('pt_da_data', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/TRIALdapt.geojson'
  });

  map.addLayer({
    id: 'pt_da_data',
    type: 'fill',
    source: 'pt_da_data',
    paint: {
      'fill-opacity': 0.66
    }
  });

  map.setLayoutProperty('walk_data', 'visibility', 'none');
  map.setLayoutProperty('walk_da_data', 'visibility', 'none');
  map.setLayoutProperty('pt_data', 'visibility', 'none');
  map.setLayoutProperty('pt_da_data', 'visibility', 'none');

  // Add event listeners for checkboxes
  document.querySelectorAll('input[name="day"], input[name="time"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateFilters);
  });

  // Add event listener for reset button
  document.getElementById('reset-filters').addEventListener('click', () => {
    // Uncheck all checkboxes
    document.querySelectorAll('input[name="day"], input[name="time"]').forEach(checkbox => {
      checkbox.checked = false;
    });

    // Reset filters
    currentDayFilter = ['all'];
    currentTimeFilter = ['all'];
    map.setFilter('locations-layer', ['all']);
  });
});

let currentDayFilter = ['all']; // Stores the current day filter
let currentTimeFilter = ['all']; // Stores the current time filter

// Function to update filters when checkboxes are clicked
function updateFilters() {
  // Get selected days
  const selectedDays = Array.from(document.querySelectorAll('input[name="day"]:checked'))
    .map(checkbox => checkbox.value.trim()); // Trim to remove extra spaces

  // Update the day filter
  currentDayFilter = ['all'];
  selectedDays.forEach(day => {
    const dayFilter = ['any',
      ['==', ['at', 0, ['coalesce', ['get', day], ['literal', [0, 0, 0]]]], 1], // Check first element (morning)
      ['==', ['at', 1, ['coalesce', ['get', day], ['literal', [0, 0, 0]]]], 1], // Check second element (afternoon)
      ['==', ['at', 2, ['coalesce', ['get', day], ['literal', [0, 0, 0]]]], 1]  // Check third element (evening)
    ];
    currentDayFilter.push(dayFilter);
  });

  // Get selected times
  const selectedTimes = Array.from(document.querySelectorAll('input[name="time"]:checked'))
    .map(checkbox => checkbox.value);

  // Update the time filter
  currentTimeFilter = ['all'];
  selectedTimes.forEach(time => {
    const timeIndex = { morning: 0, afternoon: 1, evening: 2 }[time];
    const timeFilter = ['any'];
    selectedDays.forEach(day => {
      timeFilter.push(['==', ['at', timeIndex, ['coalesce', ['get', day], ['literal', [0, 0, 0]]]], 1]);
    });
    currentTimeFilter.push(timeFilter);
  });

  // Apply the combined filters
  const combinedFilter = ['all', ...currentDayFilter.slice(1), ...currentTimeFilter.slice(1)];
  map.setFilter('locations-layer', combinedFilter);

  // Debugging: Log selected days and times
  console.log('Selected Days:', selectedDays);
  console.log('Selected Times:', selectedTimes);
  console.log('Combined Filter:', combinedFilter);
}

  function filterWalkPolygons(e) {
    var foodProg = e.features[0].properties.OBJECTID.toString();

    // Set visibility
    map.setLayoutProperty('walk_data', 'visibility', 'visible');

    map.setPaintProperty('walk_data', 'fill-color', [
      'case',
      ['==', ['get', foodProg], null], 'rgba (0,0,0,0)',
      ['step', ['to-number', ['get', foodProg]],
        '#063b00', 10,
        '#089000', 20,
        '#0eff00', 30,
        'rgba (0,0,0,0)'
      ]
    ]);
  }

  function filterPTPolygons(e) {
    var foodProg = e.features[0].properties.OBJECTID.toString();

    map.setLayoutProperty('pt_data', 'visibility', 'visible');

    map.setPaintProperty('pt_data', 'fill-color', [
      'case',
      ['==', ['get', foodProg], null], 'rgba (0,0,0,0)',
      ['step', ['to-number', ['get', foodProg]],
        '#063b00', 15,
        '#089000', 30,
        '#0eff00', 45,
        'rgba (0,0,0,0)'
      ]
    ]);
  }

  map.on('click', 'locations-layer', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();

    map.flyTo({
      center: coordinates,
      zoom: 12,
      essential: true
    });

    filterPTPolygons(e);
  });