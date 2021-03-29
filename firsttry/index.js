import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

	let njMap = L.map('mapid').setView([40.4, -74.6], 8);
	let muniData = {};
	let muniLayer = {};

	function addMuniData() {
		muniLayer = L.geoJSON(muniData).addTo(njMap);
		console.log(muniData);
	};

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(njMap);
	
	axios.get('https://opendata.arcgis.com/datasets/3d5d1db8a1b34b418c331f4ce1fd0fef_2.geojson')
		.then((response) => {
			muniData = response.data
			addMuniData();
	});
	
