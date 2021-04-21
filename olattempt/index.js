import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css'
import './styles.css';
import {Map, View} from 'ol';
import axios from 'axios';
import proj4 from 'proj4';
import GeoJSON from 'ol/format/GeoJSON';
import {Stamen, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Fill, Stroke, Circle, Text, Style} from 'ol/style';
import {Point} from 'ol/geom';
import {getCenter} from 'ol/extent';
import constants from './constants';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';
import ScaleLine from 'ol/control/ScaleLine';
import Legend from 'ol-ext/control/Legend';

proj4.defs('EPSG:4269');
register(proj4);

let flMap = new Map({
  target: 'map',
  layers: [
  /*
	new TileLayer({
	  source: new Stamen({layer:'toner-lite'})
	})
*/
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
			addCountyData();
			loading.classList.add('s-hidden');
		})
		.catch((error) => {
			console.log(error);
		});		
}

function getFeatureStyle(feature) {
	const countyName = feature.get('NAME') ? feature.get('NAME').toUpperCase() : '';
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
				radius: Math.sqrt(popDensity/Math.PI)*constants.CIRCLES_STYLE.OUTER.SCALE_FACTOR+1.5,
				fill: new Fill(constants.CIRCLES_STYLE.OUTER.FILL),
			}),
			geometry: new Point(center),
			text: new Text({
				text: countyName,
				font: constants.COUNTY_NAME_STYLE.FONT,
				offsetY: constants.COUNTY_NAME_STYLE.OFFSET_Y,
				stroke: new Stroke({
					width: 2,
					color: 'white'
				}),
				fill: new Fill({
					color: 'gray'
				})
			})
		}),
		new Style({
			image: new Circle({
				radius: Math.sqrt(popDensity/Math.PI)*constants.CIRCLES_STYLE.INNER.SCALE_FACTOR+0.5,
				fill: new Fill(constants.CIRCLES_STYLE.INNER.FILL),
			}),
			geometry: new Point(center)
		})
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
	dressItUp();
}

function dressItUp() {
	flMap.addControl(new ScaleLine({
		'bar': constants.SCALEBAR.BAR,
		'steps': constants.SCALEBAR.STEPS,
		'units': constants.SCALEBAR.UNITS,
		'minWidth': constants.SCALEBAR.MINWIDTH,
		'className': constants.SCALEBAR.CLASSNAME
	}));
	addLegend();
	addPopUpInteraction();
}

function addLegend() {
	let legend = new Legend({ 
		collapsible: constants.LEGEND.COLLAPSIBLE,
		title: constants.LEGEND.TITLE,
		style: getFeatureStyle,
		margin: constants.LEGEND.MARGIN,
		className: constants.LEGEND.CLASSNAME
	})

	flMap.addControl(legend);
	
	constants.LEGEND.CLASSES.forEach(lclass => {
		legend.addRow({
			'title': lclass.TITLE,
			'properties': {
				'POP2000': lclass.VALUE,
				'SQMI': 1
			},
			typeGeom: 'Point'
		});
	});
};

function addPopUpInteraction() {
	let selected = null;
	let status = document.getElementById('status');

	flMap.on('pointermove', function (e) {
	  if (selected !== null) {
		selected.setStyle(undefined);
		selected = null;
	  }

	  flMap.forEachFeatureAtPixel(e.pixel, function (f) {
		selected = f;
		//f.setStyle(highlightStyle);
		return true;
	  });

	  if (selected) {
		const prettyPop = selected.get('POP2000').toLocaleString();
		const density = Math.round(selected.get('POP2000')/selected.get('SQMI'));  
		
		status.innerHTML = `
			<h3>${ selected.get('NAME') } County</h3>
			<ul>
				<li><strong>Population (2000):</strong> ${ prettyPop } </li>
				<li><strong>Density:</strong> ${ density } people / mi<sup>2</sup></li>
			</ul>
			`
	  } else {
		status.innerHTML = constants.POPUP_EMPTY_TEXT;
	  }
	});
}

loadCountyData();
//document.addEventListener('DOMContentLoaded', loadCountyData);