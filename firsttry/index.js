import 'leaflet/dist/leaflet.css';
import './styles.css';
import L from 'leaflet';
import axios from 'axios';
import constants from './constants';

	let flMap = L.map('mapid', {
		center: constants.MAP_CENTER,
		zoom: 7,
		zoomControl: false,
		scrollWheelZoom: false
	});
	let countyData = {};
	let countyLayer = {};


	function createMap() {
		L.tileLayer(constants.BASEMAP_URL, {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
				'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			id: 'mapbox/streets-v11',
			tileSize: 512,
			zoomOffset: -1
		}).addTo(flMap);
	}

	function loadCountyData() {
		const loading = document.querySelector('.loading')
		loading.classList.remove('s-hidden');
		
		axios.get(constants.FL_COUNTIES_URL)
			.then((response) => {
				countyData = response.data
				addCountyData();
				loading.classList.add('s-hidden');
			})
			.catch((error) => {
				console.log(error);
			});		
	}

	function addCountyData() {
		countyLayer = L.geoJSON(countyData, constants.COUNTY_OPTIONS)
			.bindPopup(function(layer) {
				return layer.feature.properties.POP2000
			})
			.addTo(flMap);
		console.log(constants.HELLO);
		drawCenterSymbols();
	};
	
	function drawCenterSymbols() {
		countyData.features.forEach(feature => {

			const center = L.polygon(feature.geometry.coordinates).getBounds().getCenter();
			//console.log(feature.properties);
			const popDensity = feature.properties.POP2000/feature.properties.SQMI;
			L.circle([center.lng, center.lat], {
				'radius': constants.OUTER_CIRCLE_SF*popDensity + 3000,
				'className': constants.OUTER_CIRCLE_CLASSNAME
			}).addTo(flMap);
			L.circle([center.lng, center.lat], {
				'radius': constants.INNER_CIRCLE_SF * popDensity,
				'className': constants.INNER_CIRCLE_CLASSNAME
			}).addTo(flMap);
		})
	};
	function dressItUp() {
		L.control.scale().addTo(flMap);
		L.control.zoom({'position': 'topright'}).addTo(flMap);
	}
	
	createMap();
	loadCountyData();
	dressItUp();



	
