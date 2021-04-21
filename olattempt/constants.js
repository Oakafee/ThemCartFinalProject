export default {
	FL_COUNTIES_URL: 'https://fl-counties.s3.us-east-2.amazonaws.com/florida-counties-json.geojson',
	MAP_CENTER: [-84.0, 27.8],
	// order of coordinates reverse from leaflet
	//MAP_ZOOM: 7,
	MAP_RESOLUTION: 0.011, //scale units per pixel
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
	COUNTY_NAME_STYLE: {
		FONT: '6px sans-serif',
		OFFSET_Y: -8	,		
	},
	CIRCLES_STYLE: {
		OUTER: {
			FILL: {
				color: 'red',
			},
			SCALE_FACTOR: 0.3
		},
		INNER: {
			FILL: {
				color: 'rgba(233,255,189,1)'
			},
			SCALE_FACTOR: 0.1
		}
	},
	SCALEBAR: {
		BAR: true,
		STEPS: 4,
		MINWIDTH: 200,
		UNITS: 'us',
		CLASSNAME: 'fl-map__scalebar'
	},
	LEGEND: {
		COLLAPSIBLE: false,
		TITLE: 'Persons per mi<sup>2</sup>',
		MARGIN: 8,
		CLASSNAME: 'fl-map__legend ol-legend',
		CLASSES: [
			{
				TITLE: '1330 - 3166',
				VALUE: 3166
			},
			{
				TITLE:'564 - 1329',
				VALUE: 1329
			},
			{
				TITLE:'269 - 563',
				VALUE: 563
			},
			{
				TITLE:'115 - 268',
				VALUE: 268
			},
			{
				TITLE:'8 - 114',
				VALUE: 114,
			},
		]
	},
	POPUP_EMPTY_TEXT: '<span class="fl-map__popup--empty">Hover over a county for details</span>'
}