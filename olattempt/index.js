import 'ol/ol.css';
import './styles.css';
import {Map, View} from 'ol';
import axios from 'axios';
import proj4 from 'proj4';
import GeoJSON from 'ol/format/GeoJSON';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Fill, Stroke, Style} from 'ol/style';
import constants from './constants';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';

proj4.defs('EPSG:4269');
register(proj4);

let flMap = new Map({
  target: 'map',
  layers: [
	new TileLayer({
	  source: new OSM()
	})
  ],
  view: new View({
	center: constants.MAP_CENTER,
	zoom: constants.MAP_ZOOM,
	projection: getProjection('EPSG:4269')
  })
});	

let countyData = {};

function loadCountyData() {
	const loading = document.querySelector('.loading')
	loading.classList.remove('s-hidden');
	
	axios.get(constants.FL_COUNTIES_URL)
		.then((response) => {
			countyData = response.data
			console.log(countyData.crs.properties.name);
			addCountyData();
			loading.classList.add('s-hidden');
		})
		.catch((error) => {
			console.log(error);
		});		
}

function addCountyData() {

	const countiesSource = new VectorSource({
	  features: new GeoJSON().readFeatures(countyData),
	  projection: countyData.crs.properties.name
	});

	console.log(countiesSource);

	const countiesLayer = new VectorLayer({
	  source: countiesSource,
	  style: new Style({
		stroke: new Stroke({
		  color: 'red',
		  width: 2,
		}),
		fill: new Fill({
		  color: 'rgba(255,0,0,0.2)',
		}),
	  })
	});	
	
	flMap.addLayer(countiesLayer);

}

loadCountyData();
//document.addEventListener('DOMContentLoaded', loadCountyData);