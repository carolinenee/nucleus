mapboxgl.accessToken = "pk.eyJ1IjoiY2Fyb2xpbmVuZWUiLCJhIjoiY201b2RhZmxtMGthajJucHRxcW5heGxiNyJ9.NMKAQoQvhYJ8RQq0NQuYkA"; // token to use mapbox API 
const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/mapbox/standard', // standard mapbox style 
    center: [-79.65, 43.6], // starting position [lng, lat] of peel
    zoom: 10, // starting zoom
});


map.on('load', () => {
    map.addSource('food_data', { //loading food program data 
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/carolinenee/nucleus/refs/heads/main/Food%20Services%20Locations%20and%20Day_Time%20Filters.geojson' // link to git hub raw data file
    });

    map.addLayer({ //adding the food program data to the map 
        id: 'locations-layer',
        type: 'circle',
        source: 'food_data',
        paint: {
            'circle-radius': 5,
            'circle-color': '#000000'
        }
    });
});