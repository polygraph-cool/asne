// D3 is included by globally by default
// import * as d3 from 'd3'
import loadData from './load-data'

function resize() {

}

function setup(data){

	var width = 500;
	var horzScale = d3.scaleLinear().domain([0,1]).range([0,width])
	var container = d3.select(".line-scatter");
	var yearNest = d3.nest().key(function(d){
			return +d.Year
		})
		.sortKeys(function(a,b){
			return a-b;
		})
		.rollup(function(leaves){
			var average = d3.mean(leaves,function(d){return +d.male_num/d.total_num});
			return {average:average,values:leaves};
		})
		.entries(data)
		;
	console.log(yearNest);

	//
	var years = container.selectAll("div")
		.data(yearNest)
		.enter()
		.append("div")
		.attr("class","year-container")
		;

	years.selectAll("div")
		.data(function(d){
			console.log(d);
			return d.value.values;
		})
		.enter()
		.append("div")
		.attr("class","line")
		.style("left",function(d){
			return horzScale(+d.male_num/d.total_num) + "px"
		})
		;
	years.append("div")
		.style("left",function(d){
			return horzScale(.5) + "px"
		})
		.attr("class","line line-half")
	//
	years.append("div")
		.datum(function(d){
			return d.value.average
		})
		.style("left",function(d){
			return horzScale(d) + "px"
		})
		.attr("class","line line-average")

	years.append("p")
	.text(function(d){
		return d.key
	})
}

function init() {
	console.log('Make something awesome!')
	loadData()
	.then((result) => {
		setup(result[0])
	})
	.catch(err => console.log(err))
}

export default { init, resize }
