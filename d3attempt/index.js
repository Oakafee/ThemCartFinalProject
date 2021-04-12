import * as d3 from 'd3';
import d3geo from 'd3-geo';
import axios from 'axios';
import constants from './constants';

let countyData = {};
let svg = {};

function loadCountyData() {
	//const loading = document.querySelector('.loading')
	//loading.classList.remove('s-hidden');
	
	axios.get(constants.FL_COUNTIES_URL)
		.then((response) => {
			countyData = response.data
			addCountyData();
			//loading.classList.add('s-hidden');
			console.log('data loaded');
			console.log(countyData);
		})
		.catch((error) => {
			console.log(error);
		});	
}

function addCountyData() {

	var svg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500)
	.attr("viewBox", "-100 -50 80 80")
	.attr("class", "fl-shape");
	
	var projection = d3.geoIdentity().reflectY(true);
	
	svg.append("path")
		.datum({type: "FeatureCollection", features: countyData.features})
		.attr("d", d3.geoPath().projection(projection));
	console.log(svg);
}

loadCountyData();