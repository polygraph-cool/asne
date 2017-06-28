// D3 is included by globally by default

var dataset;

var fields = ["NLWhM","NLWhF","AOJWhM","AOJWhF",
"NLBlM","NLBlF","AOJBlM","AOJBlF",
"NLHispM","NLHispF","AOJHispM","AOJHispF",
"NLNAM","NLNAF","AOJNAM","AOJNAF",
"NLAsM","NLAsF","AOJAsM","AOJAsF",
"NLOthM","NLOthF","AOJOthM","AOJOthF"];

var yLabels = ["White", "Black", "Hispanic", "Native Amer", "Asian", "Other"];

var xLabels = ["Male Leaders", "Female Leaders", "Male Employees", "Female Employees"];

var rowYCoord = [0, 151, 206, 261, 316, 371];
var svg;

function init() {
	// initialize the data

	d3.csv("/assets/allbreakdowns.csv", function(data) {
		dataset = data;
		data.forEach(function(d) {
			for (var property in d) {
				if (d.hasOwnProperty(property)) {
					d[property] = parseFloat(d[property]);
				}
			}
		});
		generateVis();
	});
}

function generateVis() {
	var w = 500;
	var h = 1800;

	svg = d3.select("#newsroom")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

	drawLabels(w);
	drawCirclesPerYear(0);
}

function drawLabels(w) {
	svg.append("rect")
		.attr("fill", "#eee")
		.attr("x", 0)
		.attr("y", rowYCoord[1] + 10)
		.attr("width", w)
		.attr("height", 55);

	svg.append("rect")
		.attr("fill", "#eee")
		.attr("x", 0)
		.attr("y", rowYCoord[3] + 10)
		.attr("width", w)
		.attr("height", 55);

	svg.append("rect")
		.attr("fill", "#eee")
		.attr("x", 0)
		.attr("y", rowYCoord[5] + 10)
		.attr("width", w)
		.attr("height", 55);


	for (var x = 0 ; x < yLabels.length; x++) {
		svg.append("text")
			.text(yLabels[x])
			.attr("x", 11)
			.attr("y", 40 + rowYCoord[x])
			.attr("font-size", 11)
	}

	for (var y = 0 ; y <= xLabels.length + 1; y++) {
		var columnXCoord = 75 + 100 * y;
		svg.append("text")
			.text(xLabels[y])
			.attr("x", columnXCoord)
			.attr("y", 11)
			.attr("font-size", 11)
	}
}

function drawCirclesPerYear(year) {
	var circleGroup = svg.append("g").attr("id", "circles");
	var radius = 5;
	var circleMargin = 2;
	var xOffset = 75;
	var yOffset = 30;
	var fieldXSpacing = radius * 21;
	var fieldYSpacing = 20;
	var lastY = 0;
	var tempLastY = 0; // keeps track of the last Y coordinate in the male column for comparison to the last Y coordinate in the female column so that the next field starts at the right Y value
	var numColumns = 4;

	d3.select("#year").text("The Newsroom in " + (year + 2001));

	for (var j = 0; j < fields.length; j++) {
		var fieldY = rowYCoord[Math.floor(j / numColumns)];

		var numCircles = Math.ceil(dataset[year][fields[j]])-1;

		d3.range(numCircles + 1).forEach(function(i) {
			if (numCircles > 0) {
				var y = yOffset + radius + fieldY + Math.floor(i / 5) * (radius * 2 + circleMargin);
				if (j % 2) {
					var color = "blue";
				} else {
					var color = "red";
				}
			// set color of circles and Y val
			if ((j % numColumns) < numColumns - 1) {
				if (y > tempLastY) tempLastY = y;
			} else {
				if (tempLastY > y) {
					lastY = tempLastY + fieldYSpacing;
				} else {
					lastY = y + fieldYSpacing;
				}
			}

			circleGroup.append("circle")
			.attr("fill", color)
			.attr("cx", xOffset + radius + (i % 5) * (radius * 2 + circleMargin) + (j % numColumns) * fieldXSpacing)
			.attr("cy", y)
			.attr("r", radius)
		}
	});
	}

	if (year < 15) {
		sleep(1000).then(() => {
			d3.select("#circles").remove();
    	drawCirclesPerYear(year + 1)
		});
	} else {
		sleep(1000).then(() => {
			d3.select("#circles").remove();
    	drawCirclesPerYear(0)
		});
	}
}

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default { init }
