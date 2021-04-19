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
    .attr("width", constants.MAP_WIDTH)
    .attr("height", constants.MAP_HEIGHT)
	.attr("viewBox", "50 -250 500 500")
	.attr("class", "fl-shape");
	
	var projection = d3.geoTransverseMercator()
		.rotate([81, -24 - 20 / 60])
		.scale(4000);
	// from https://github.com/veltman/d3-stateplane
	
	/*
	svg.append("path")
		.datum({type: "FeatureCollection", features: countyData.features})
		.attr("d", d3.geoPath().projection(projection));
	*/
	
	svg.selectAll("path")
		.data(countyData.features)
		.enter().append("path")
		.attr("d", d3.geoPath().projection(projection));
		
	svg.append("g")
		  .attr("fill", "brown")
		  .attr("fill-opacity", 0.5)
		  .attr("stroke", "#fff")
		  .attr("stroke-width", 0.5)
		.selectAll("circle")
		.data(countyData.features
			.filter(d => d.properties.POP2000)
			.sort((a, b) => d3.descending(a.value, b.value)))
		.join("circle")
		  .attr("transform", d => {
			  const x = d.geometry.coordinates[0][0][0];
			  const y = d.geometry.coordinates[0][0][1];
			  console.log(x, y);
			  if (typeof x != 'object') {
				return `translate(${(500 + x)},${y})`;			  					
			  }
			  return `translate(100, 200)`;

		  })
		  .attr("r", d => d.properties.POP2000/50000);
}

loadCountyData();