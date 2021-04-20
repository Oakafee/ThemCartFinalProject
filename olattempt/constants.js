export default {
	FL_COUNTIES_URL: 'https://fl-counties.s3.us-east-2.amazonaws.com/florida-counties-json.geojson',
	MAP_CENTER: [-84.0, 27.8],
	// order of coordinates reverse from leaflet
	//MAP_ZOOM: 7,
	MAP_RESOLUTION: 0.018, //scale units per pixel
	COUNTIES_STYLE: {
		STROKE: {
			color: 'gray',
			width: 0.6,			
		},
		FILL: {
			color: 'rgba(233,255,189,1)',
			opacity: 1,
		}
	},
	OUTER_CIRCLE_SF: 3,
}