import 'leaflet/dist/leaflet.css';
import './styles.css';
import L from 'leaflet';
import axios from 'axios';
import constants from './constants';

	let flMap = L.map('mapid', {
		center: constants.MAP_CENTER,
		zoom: 7,
		zoomControl: false,
		scrollWheelZoom: false,
		attributionControl: false,
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
		countyLayer = L.geoJSON(countyData, {
			'style': {
				'className': constants.COUNTIES_CLASSNAME,
			},
			'onEachFeature': (feature, layer) => {
				layer.bindPopup(writePopup(feature.properties));
			},
		}).addTo(flMap);
		console.log(constants.HELLO);
		drawCenterSymbols();
	};
	
	function drawCenterSymbols() {
		countyData.features.forEach(feature => {

			const center = L.polygon(feature.geometry.coordinates).getBounds().getCenter();
			//console.log(feature.properties);
			const popDensity = feature.properties.POP2000/feature.properties.SQMI;
			L.circleMarker([center.lng, center.lat], {
				'radius': Math.sqrt(popDensity/Math.PI)*constants.OUTER_CIRCLE_SF+1.5,
				// todo: clean up and make size dynamic
				'className': constants.OUTER_CIRCLE_CLASSNAME,
			})
				.bindPopup(writePopup(feature.properties))
				.addTo(flMap);
			L.circleMarker([center.lng, center.lat], {
				'radius': Math.sqrt(popDensity/Math.PI)*constants.INNER_CIRCLE_SF+0.5,
				'className': constants.INNER_CIRCLE_CLASSNAME
			}).addTo(flMap);
		})
	};
	
	function writePopup(props) {
		const prettyPop = props.POP2000.toLocaleString();
		const density = Math.round(props.POP2000/props.SQMI);
		return `
			<div class='popup'>
				<h1>${ props.NAME } County</h1>
				<ul>
					<li><strong>Population (2000):</strong> ${prettyPop} </li>
					<li><strong>Density:</strong> ${density} people / mi<sup>2</sup></li>
				</ul>
			</div>
		`;
	}
	
	function dressItUp() {
		L.control.scale().addTo(flMap);
		L.control.zoom({'position': 'topright'}).addTo(flMap);
	}
	
	createMap();
	loadCountyData();
	dressItUp();




	
