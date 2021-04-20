import 'ol/ol.css';
import './styles.css';
import {Map, View} from 'ol';
import axios from 'axios';
import proj4 from 'proj4';
import GeoJSON from 'ol/format/GeoJSON';
import {Stamen, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Fill, Stroke, Circle, Style} from 'ol/style';
import {Point} from 'ol/geom';
import {getCenter} from 'ol/extent';
import constants from './constants';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';

proj4.defs('EPSG:4269');
register(proj4);

let flMap = new Map({
  target: 'map',
  layers: [
	new TileLayer({
	  source: new Stamen({layer:'toner-lite'})
	})
  ],
  view: new View({
	center: constants.MAP_CENTER,
	resolution: constants.MAP_RESOLUTION, //instead of zoom
	//zoom: constants.MAP_ZOOM,
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

function getFeatureStyle(feature) {
	const popDensity = feature.get('POP2000')/feature.get('SQMI');
	const center = getCenter(feature.getGeometry().getExtent());
	
	//console.log(getCenter(feature.getGeometry().getExtent()));
	
	return [
		new Style({
			stroke: new Stroke(constants.COUNTIES_STYLE.STROKE),
			fill: new Fill(constants.COUNTIES_STYLE.FILL),
		  }),
		new Style({
			image: new Circle({
			  radius: 10,
			  fill: new Fill ({
				color: [0,128,255,.3],
			  }),
			  stroke: new Stroke ({
				width: 1,
				color: [0,128,255],
			  })
			}),
			geometry: new Point(center)	
		})

		/*
		new Style({
			image: new Circle({
			  'radius': constants.OUTER_CIRCLE_SF*popDensity + 3000,
			  //radius: Math.sqrt(feature.get('pop')/Math.PI) / 50, 
			  fill: new Fill ({
				color: [0,128,255,.3],
			  }),
			  stroke: new Stroke ({
				width: 1,
				color: [0,128,255],
			  })
			}),
			//geometry: new Point([-84.0, 27.8])
		})
		*/
	]
}

function addCountyData() {

	const countiesSource = new VectorSource({
	  features: new GeoJSON().readFeatures(countyData),
	  projection: countyData.crs.properties.name
	});

	console.log(countiesSource);

	const countiesLayer = new VectorLayer({
	  source: countiesSource,
	  style: getFeatureStyle
	});	
	
	flMap.addLayer(countiesLayer);

}

loadCountyData();
//document.addEventListener('DOMContentLoaded', loadCountyData);