document.addEventListener('DOMContentLoaded', function () {

  mapboxgl.accessToken = "pk.eyJ1IjoiY2Fyb2xpbmVuZWUiLCJhIjoiY201b2RhZmxtMGthajJucHRxcW5heGxiNyJ9.NMKAQoQvhYJ8RQq0NQuYkA"; // token to use mapbox API 
  const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/mapbox/standard', // standard mapbox style 
    center: [-79.7018518888638, 43.668552107715904], // starting position [lng, lat] of Peel Region
    zoom: 9, // starting zoom level
  });

  map.on('load', () => {

    //loading food program point data
    map.addSource('food_data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/Food%20Services%20Locations%20and%20Day_Time%20Filters.geojson' // link to git hub raw data file
    });

    //adding the food program point data to the map 
    map.addLayer({
      id: 'food_data',
      type: 'circle',
      source: 'food_data',
      paint: {
        'circle-radius': 5,
        'circle-color': '#000000'
      }
    });

    //loading walk coverage data
    map.addSource('walk_data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/walk.geojson'
    });

    //adding the walk coverage data to the map
    map.addLayer({
      id: 'walk_data',
      type: 'fill',
      source: 'walk_data',
      paint: {
        'fill-opacity': 0.66
      }
    });

    //loading public transit coverage data
    map.addSource('pt_data', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/totalpt.geojson'
    });

    //adding the public transit coverage data to the map
    map.addLayer({
      id: 'pt_data',
      type: 'fill',
      source: 'pt_data',
      paint: {
        'fill-opacity': 0.66
      }
    });

    //setting both walking and public transit coverage layers to invisible at first because they will be activated later
    map.setLayoutProperty('walk_data', 'visibility', 'none');
    map.setLayoutProperty('pt_data', 'visibility', 'none');

    initCheckboxListeners();
    // Add the geocoder to the map
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false, // Set to true if you want a marker at the location
      placeholder: 'Search for places or addresses'
    });

    // Add geocoder to the map
    map.addControl(
      geocoder,
      'top-left' // Position og geocoder relative to map 
    );

    // listen for geocoder result event
    geocoder.on('result', (e) => {
      console.log('Selected location:', e.result);
    });
  });

  let selectedDay = null;
  let selectedTime = null;

  // Function to update filters when checkboxes are clicked
  function updateFilters() {

    console.log('Updating filters with day:', selectedDay, 'and time:', selectedTime);

    if (!selectedDay || !selectedTime) {
      map.setFilter('food_data', ['all']);
      return;
    }

    const timeIndex = { morning: 0, afternoon: 1, evening: 2 }[selectedTime];

    const filter = [
      '==',
      ['at', timeIndex, ['coalesce', ['get', selectedDay], ['literal', [0, 0, 0]]]],
      1
    ];

    map.setFilter('food_data', ['all', filter]);

    if (foodProg) updateLayers();
  };

  document.querySelectorAll('.day-option').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      selectedDay = e.target.dataset.day;

      document.querySelectorAll('.day-option').forEach(opt => opt.classList.remove('active'));
      e.target.classList.add('active');

      updateFilters();
    });
  });

  document.querySelectorAll('.time-option').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      selectedTime = e.target.dataset.time;

      document.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('active'));
      e.target.classList.add('active');

      updateFilters();
    });
  });

  document.getElementById('reset-filters').addEventListener('click', () => {
    selectedDay = null;
    selectedTime = null;

    document.querySelectorAll('.day-option, .time-option').forEach(opt => opt.classList.remove('active'));

    map.setFilter('food_data', ['all']);

    document.getElementById('walk_pt').checked = false;
    document.getElementById('walk').disabled = true;
    document.getElementById('walk_pt').disabled = true;

    map.flyTo({
      center: [-79.7018518888638, 43.668552107715904],
      zoom: 9,
      essential: true
    });

    map.setLayoutProperty('walk_data', 'visibility', 'none');
    map.setLayoutProperty('pt_data', 'visibility', 'none');
  });

  //-------------------------------------------------------------------------------------------------------------------------

  //From Khalis separate files
  map.on('click', 'food_data', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const programName = e.features[0].properties.NAME || "Unknown Name";
    const programAddress = e.features[0].properties.ADRESS || "Unknown Address";
    const programWebsite = e.features[0].properties.WEBSITE || "No Available Website";
    const programPhone = e.features[0].properties.PHONE || "No Known Phone Number";
    const programHours = e.features[0].properties.HOURS || "Unknown Hours";


    map.flyTo({
      center: coordinates,
      zoom: 11,
      essential: true
    });
    //info container data 
    foodProg = e.features[0].properties.OBJECTID.toString();
    console.log('foodProg set to:', foodProg);

    document.getElementById('walk').disabled = false;
    document.getElementById('walk_pt').disabled = false;

    // Update the details container
    document.getElementById('program-name').textContent = programName;
    document.getElementById('program-address').textContent = programAddress;
    document.getElementById('program-phone').textContent = programPhone;
    document.getElementById('program-hours').textContent = programHours;
    // get website URL 
    const websiteElement = document.getElementById('program-website');
    if (programWebsite) {
        websiteElement.innerHTML = `<a href="${programWebsite}" target="_blank">${programWebsite}</a>`;
    } else {
        websiteElement.textContent = "No website available";
    }
    document.getElementById('program-website').innerHTML = programWebsite ? `<a href="${programWebsite}" target="_blank">${programWebsite}</a>` : "No website available";


    initCheckboxListeners();

    updateLayers();
  });

  function initCheckboxListeners() {
    document.getElementById('walk').addEventListener('change', function () {
      console.log('Walk checkbox toggled:', this.checked);
      if (this.checked) {
        document.getElementById('walk_pt').checked = false; // Disable the other checkbox
      } else {
        document.getElementById('walk_pt').checked = true; // Re-enable the other checkbox
      }
      updateLayers(); // Update the map layers
    });

    document.getElementById('walk_pt').addEventListener('change', function () {
      console.log('Walk + PT checkbox toggled:', this.checked);
      if (this.checked) {
        document.getElementById('walk').checked = false; // Disable the other checkbox
      } else {
        document.getElementById('walk').checked = true; // Re-enable the other checkbox
      }
      updateLayers(); // Update the map layers
    });
  };

  function updateLayers() {
    if (!foodProg) return;

    if (document.getElementById('walk').checked) {
      filterWalkPolygons(foodProg);
      map.setLayoutProperty('pt_data', 'visibility', 'none');
    } else if (document.getElementById('walk_pt').checked) {
      filterPTPolygons(foodProg);
      map.setLayoutProperty('walk_data', 'visibility', 'none');
    } else {
      map.setLayoutProperty('walk_data', 'visibility', 'none');
      map.setLayoutProperty('pt_data', 'visibility', 'none');
    }

  }

  function filterWalkPolygons(foodProg) {
    // Set visibility
    map.setLayoutProperty('walk_data', 'visibility', 'visible');

    map.setPaintProperty('walk_data', 'fill-color', [
      'case',
      ['==', ['get', foodProg], null], 'rgba(0,0,0,0)',
      ['step', ['to-number', ['get', foodProg]],
        '#063b00', 10,
        '#089000', 20,
        '#0eff00', 30,
        'rgba(0,0,0,0)'
      ]
    ]);
  }

  function filterPTPolygons(foodProg) {

    foodProg = foodProg + '_' + selectedDay + selectedTime;

    map.setLayoutProperty('pt_data', 'visibility', 'visible');

    map.setPaintProperty('pt_data', 'fill-color', [
      'case',
      ['==', ['get', foodProg], null], 'rgba(0,0,0,0)',
      ['step', ['to-number', ['get', foodProg]],
        '#4c00a4', 30,
        '#00bbd1', 45,
        '#00fff3', 60,
        'rgba(0,0,0,0)'
      ]
    ]);
  }

}
);
