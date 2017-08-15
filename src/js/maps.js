
var states = [
  ["Maine","ME",1,"Northeast",23],
  ["Vermont","VT",2,"Northeast",50],
  ["New Hampshire","NH",3,"Northeast",33],
  ["Rhode Island","RI",4,"Northeast",44],
  ["Massachusetts","MA",5,"Northeast",25],
  ["Connecticut","CT",6,"Northeast",9],
  ["Delaware","DE",7,"Northeast",10],
  ["New Jersey","NJ",8,"Northeast",34],
  ["New York","NY",9,"Northeast",36],
  ["Pennsylvania","PA",10,"Northeast",42],
  ["District of Columbia","DC",11,"Northeast",11],
  ["Maryland","MD",12,"Northeast",24],
  ["Virginia","VA",13,"South",51],
  ["North Carolina","NC",14,"South",37],
  ["South Carolina","SC",15,"South",45],
  ["Georgia","GA",16,"South",13],
  ["Alabama","AL",17,"South",1],
  ["Mississippi","MS",18,"South",28],
  ["Louisiana","LA",19,"South",22],
  ["Arkansas","AR",20,"South",5],
  ["Tennessee","TN",21,"South",47],
  ["Kentucky","KY",22,"South",21],
  ["West Virginia","WV",23,"South",54],
  ["Oklahoma","OK",24,"Midwest",40],
  ["Colorado","CO",25,"West",8],
  ["Utah","UT",26,"West",49],
  ["Idaho","ID",27,"West",16],
  ["Wyoming","WY",28,"West",56],
  ["Montana","MT",29,"West",30],
  ["North Dakota","ND",30,"Midwest",38],
  ["South Dakota","SD",31,"Midwest",46],
  ["Nebraska","NE",32,"Midwest",31],
  ["Kansas","KS",33,"Midwest",20],
  ["Iowa","IA",34,"Midwest",19],
  ["Minnesota","MN",35,"Midwest",27],
  ["Wisconsin","WI",36,"Midwest",55],
  ["Indiana","IN",37,"Midwest",18],
  ["Missouri","MO",38,"Midwest",29],
  ["Ohio","OH",39,"Midwest",39],
  ["Michigan","MI",40,"Midwest",26],
  ["Illinois","IL",41,"Midwest",17],
  ["Florida","FL",42,"South",12],
  ["California","CA",43,"West",6],
  ["Nevada","NV",44,"West",32],
  ["Texas","TX",45,"South",48],
  ["Arizona","AZ",46,"West",4],
  ["New Mexico","NM",47,"West",35],
  ["Alaska","AK",48,"West",2],
  ["Washington","WA",49,"West",53],
  ["Oregon","OR",50,"West",41],
  ["Hawaii","HI",51,"West",15],
  ]
  ;

function init(mapData,latLongData,newsIDLocation,newsIDInfo,stateTopo) {

  // var projection = d3.geoAlbersUsa()
  //     // .scale(1280)
  //     // .translate([width / 2, height / 2]);
  //
  // var path = d3.geoPath()
  //     .projection(projection)
  //     // .pointRadius(1.5)
  //     ;
  //
  // // var projection = d3.geoAlbersUsa();
  // // var path = d3.geoPath().projection(projection);
  //
	// var cut = "gender"
	// // var cut = "supGender"
  // var countMin =  19;
  //
  // mapData = mapData.filter(function(d){
  //   return +d.Year > 2000;
  // })
  //
	// function getAverage(data){
	// 	if(cut == "gender"){
  //     var mean = d3.mean(data,function(d){return +(data.total_num-data.male_num)/data.total_num});
	// 		return mean;
	// 	}
	// 	if(cut == "supWhite"){
	// 		return d3.mean(data,function(d){return +data.white_sup_num/data.total_sup_num});
	// 	}
	// 	if(cut == "supGender"){
	// 		return d3.mean(data,function(d){return (+data.total_sup_num - +data.male_sup_num)/data.total_sup_num});
	// 	}
	// 	return d3.mean(data,function(d){return +data.white_num/data.total_num});
	// }
  //
	// function getPercent(data){
	// 	if(cut == "gender"){
	// 		return +(data.total_num-data.male_num)/data.total_num
	// 	}
	// 	if(cut == "supWhite"){
	// 		return +data.white_sup_num/data.total_sup_num;
	// 	}
	// 	if(cut == "supGender"){
	// 		return +data.male_sup_num/data.total_sup_num;
	// 	}
	// 	return (+data.total_num - +data.white_num)/data.total_num
	// }
  //
  // function getPercentType(kind,data){
  //   if(kind == "gender"){
  //     return +(data.total_num-data.male_num)/data.total_num
  //   }
  //   if(kind == "supWhite"){
  //     return +data.white_sup_num/data.total_sup_num;
  //   }
  //   if(kind == "supGender"){
  //     return (+data.total_sup_num - +data.male_sup_num)/data.total_sup_num;
  //   }
  //   return (+data.total_num - +data.white_num)/data.total_num
  // }
  //
	// var latLongMap = d3.map(latLongData,function(d){ return d.NewsID});
	// var newsIdMap = d3.map(newsIDLocation,function(d){ return d.NewsID});
  // var newsIDName = d3.map(newsIDInfo,function(d){ return d.NewsID});
	// var regionMap = d3.map(states,function(d){
	// 	return d[1];
	// });
  //
  // var margin = {top: 40, right: 40, bottom: 40, left: 40};
	// var width = 600 - margin.left - margin.right;
  // var height = 300 - margin.top - margin.bottom;
	// var horzScale = d3.scaleLinear().domain([0,1]).range([0,width])
	// var container = d3.select(".maps");
  //
  // var toggles = container.append("div")
  //   .attr("class","histogram-chart-toggle-wrapper");
  //
  // toggles
  //   .append("div")
  //   .attr("class","histogram-chart-toggle-size")
  //   .selectAll("p")
  //   .data([0,20,50,100,500])
  //   .enter()
  //   .append("p")
  //   .attr("class","histogram-chart-toggle-item")
  //   .text(function(d){
  //     return d;
  //   })
  //   .on("click",function(d){
  //     countMin = d;
  //     buildChart();
  //   })
  //   ;
  //
  // toggles
  //   .append("div")
  //   .attr("class","histogram-chart-toggle-type")
  //   .selectAll("p")
  //   .data(["race","gender","supWhite","supGender"])
  //   .enter()
  //   .append("p")
  //   .attr("class","histogram-chart-toggle-item")
  //   .text(function(d){
  //     return d;
  //   })
  //   .on("click",function(d){
  //     cut = d;
  //     buildChart();
  //   })
  //   ;
  //
  // function buildChart(){
  //
  //
  //
  //   d3.selectAll(".maps-chart-wrapper").remove();
  //
  //   var chartDiv = container
  //     .append("div")
  //     .attr("class","maps-chart-wrapper")
  //
  //   var mapSvg = chartDiv.append("svg")
  //     .attr("class","maps-chart-svg")
  //     .attr("viewBox","0 0 960 600")
  //     ;
  //
  //   mapSvg.append("g")
  //     .attr("class", "states")
  //     .selectAll("path")
  //     // .data(topojson.feature(stateTopo, stateTopo.objects.states))
  //     .data(topojson.feature(stateTopo, stateTopo.objects.states).features)
  //     .enter().append("path")
  //     .attr("d", path);
  //
  //   mapSvg
  //     .append("g")
  //     .append("path")
  //     .attr("class", "state-borders")
  //     .attr("d", path(topojson.mesh(stateTopo, stateTopo.objects.states, function(a, b) { return a !== b; })));
  //
  //   var chartSvgDoubleChange = chartDiv
  //     .append("svg")
  //     .attr("class","maps-chart-wrapper-svg-double-change")
  //     .attr("width",width+margin.left+margin.right)
  //     .attr("height",height+margin.top+margin.bottom)
  //     .style("width",width+margin.left+margin.right+"px")
  //     .style("height",height+margin.top+margin.bottom+"px")
  //     ;
  //
  //   var miniMultiple = container.append("div")
  //     .attr("class","slope-mini-multiple-div")
  //     ;
  //
  //   var filteredMapData = mapData.filter(function(d){
  //       if(cut == "supWhite" || cut == "supGender"){
  //         return d.total_num > countMin && d.total_sup_num > 0;
  //       }
  //       return d.total_num > countMin;
  //     })
  //     ;
  //
  //   var maxPercentArray = [];
  //   var diffArray = [];
  //   var raceDiffArray = []
  //   var newsNest = d3.nest()
  //     .key(function(d){
  //       return +d.NewsID
  //     })
  //     .rollup(function(leaves){
  //       var map = d3.map(leaves,function(d){return d.Year});
  //       var maxTotalNum = d3.max(leaves,function(d){return d.total_num});
  //       var maxPercent = d3.max(leaves,function(d){ return getPercent(d)});
  //       maxPercentArray.push(maxPercent)
  //       return {yearMap:map,values:leaves,maxTotal:maxTotalNum}
  //     })
  //     .entries(filteredMapData)
  //     ;
  //
  //   newsNest = newsNest.filter(function(d){
  //     if(d.value.yearMap.has(2014)){
  //       return d;
  //     }
  //     return null;
  //   });
  //
  //   for (var item in newsNest){
  //     var diff = getPercentType("gender",newsNest[item].value.yearMap.get(2014))-getPercentType("gender",newsNest[item].value.values[0])
  //     cut = "supGender";
  //     var raceDiff = getPercent(newsNest[item].value.yearMap.get(2014))-getPercent(newsNest[item].value.values[0]);
  //     cut = "gender"
  //     diffArray.push(diff);
  //     raceDiffArray.push(raceDiff);
  //
  //     newsNest[item].value.diff = diff;
  //     newsNest[item].value.raceDiff = raceDiff;
  //     if(latLongMap.has(newsNest[item].key)){
  //       newsNest[item].value.location = latLongMap.get(newsNest[item].key)
  //       newsNest[item].value.hasLocation = true
  //     }
  //     else{
  //       newsNest[item].value.hasLocation = false
  //     }
  //   }
  //   ;
  //
  //
  //
  //   newsNest = newsNest.filter(function(d){
  //     var hasLat = false;
  //     if(d.value.hasLocation){
  //       if(d.value.location.lat != "NULL"){
  //         hasLat = true;
  //       }
  //     }
  //     return d.value.hasLocation && hasLat;
  //   })
  //
  //   var totalExtent = d3.extent(newsNest,function(d){return +d.value.maxTotal})
  //   var radiusScale = d3.scaleLinear().domain(totalExtent).range([3,40]);
  //   var percentExtent = d3.extent(maxPercentArray,function(d){return d;});
  //   var diffExtent = d3.extent(diffArray,function(d){return d; });
  //   var raceDiffExtent = d3.extent(raceDiffArray,function(d){ return d; });
  //   var diffScale = d3.scaleLinear().domain([diffExtent[0],diffExtent[1]]).range([0,width])
  //   var raceDiffScale = d3.scaleLinear().domain([raceDiffExtent[0],raceDiffExtent[1]]).range([height,0])
  //
  //   var totalScale = d3.scaleLinear().domain(totalExtent).range([height,0]);
  //   var totalXScale = d3.scaleLinear().domain(totalExtent).range([0,width]);
  //
  //   var colorScale = d3.scaleLinear().domain([diffExtent[0],0,diffExtent[1]]).range(["red","white","green"]);
  //
  //   var colorScalePercent = d3.scaleLinear().domain([-1,0,.30,.35,.4,.45,.5,.6]).range(["#000000","#000000","rgb(8, 69, 148)","rgb(33, 113, 181)","rgb(204, 219, 163)","rgb(253, 246, 163)","#e2e1e1","rgb(39, 108, 145)"]);
  //
  //   var strokeScale = d3.scaleLinear().domain([diffExtent[0],0,diffExtent[1]]).range(["red","grey","green"]);
  //
  //   var xArrowLength = d3.scaleLinear().domain([0,.15]).range([1,30]).clamp(true);
  //
  //   // newsNest = newsNest.filter(function(d){
  //   //   var percent = getPercentType("gender",d.value.yearMap.get(2014));
  //   //   return percent > .50;
  //   // })
  //
  //   var xScale = d3.scaleLinear().domain([0,.7]).range([0,width]);
  //   var yScale = d3.scaleLinear().domain([.2,.5]).range([height,0]);
  //   var lineWidthScale = d3.scaleLinear().domain(totalExtent).range([1.4,2.5]).clamp(true)
  //   // var mapMarkers = mapSvg.append("g")
  //   //   .attr("class","map-markers")
  //   //   .selectAll("circle")
  //   //   .data(newsNest)
  //   //   .enter()
  //   //   .append("circle")
  //   //   .attr("class","map-marker")
  //   //   .attr("r",function(d){
  //   //     return radiusScale(+d.value.maxTotal);
  //   //   })
  //   //   // .style("fill",function(d){
  //   //   //   //     var t0 = yScale(getPercentType("gender",d.value.values[0]))
  //   //   //   //     var t1 = yScale(getPercentType("gender",d.value.yearMap.get(2014)))
  //   //   //   return "rgb(169, 169, 169)";
  //   //   //   return colorScalePercent(getPercentType("gender",d.value.yearMap.get(2014)))
  //   //   //   return "red"
  //   //   // })
  //   //   .attr("transform",function(d){
  //   //     var location = d.value.location;
  //   //     return "translate("+projection([+location.lng,location.lat])+")";
  //   //   })
  //   //   .on("mouseover",function(d){
  //   //     // console.log(d);
  //   //     console.log(newsIDName.get(d.key).Company);
  //   //     console.log(getPercentType("gender",d.value.yearMap.get(2014)));
  //   //   })
  //   //   ;
  //
  //   var tau = 2 * Math.PI; // http://tauday.com/tau-manifesto
  //   var arc = d3.arc()
  //     .innerRadius(0)
  //     .outerRadius(10)
  //     .startAngle(0);
  //
  //   // radiusScale.range([10,20])
  //
  //   var theta1 = Math.PI * 0.75;
  //   var theta2 = Math.PI * -0.75;
  //   var sin1 = Math.sin(theta1);
  //   var sin2 = Math.sin(theta2);
  //   var cos1 = Math.cos(theta1);
  //   var cos2 = Math.cos(theta2);
  //
  //   var arrowMaps = mapSvg.append("g")
  //       .selectAll("g")
  //       .data(newsNest)
  //       .enter()
  //       .append("g")
  //       .attr("transform",function(d){
  //         var location = d.value.location;
  //         return "translate("+projection([+location.lng,location.lat])+")";
  //       })
  //       .append("path")
  //       .attr("class","map-arrow-path")
  //       .attr("d", function(d){
  //
  //         // console.log(getPercentType("gender",d.value.yearMap.get(2014)),getPercentType("gender",newsNest[item].value.values[0]));
  //         var xVal = xArrowLength(Math.abs(d.value.diff));
  //         var dx = 0;
  //         if(d.value.diff > 0){
  //           dx = xVal;
  //         }
  //         else{
  //           dx = -xVal;
  //         }
  //         var dy = -3;
  //
  //         var stemLen = Math.sqrt(dx * dx + dy * dy);
  //         var headLen = Math.min(stemLen * 0.7, 8);
  //         var xn = dx / stemLen * headLen;
  //         var yn = dy / stemLen * headLen;
  //         var ax1 = xn * cos1 - yn * sin1 + dx
  //         var ay1 = xn * sin1 + yn * cos1 + dy
  //         var ax2 = xn * cos2 - yn * sin2 + dx
  //         var ay2 = xn * sin2 + yn * cos2 + dy
  //
  //         var head = [[ax1,ay1],[dx,dy],[ax2,ay2]];
  //
  //         return "M0,0"+"L"+dx+","+dy+"L"+head[0][0]+","+head[0][1]+"L"+head[1][0]+","+head[1][1]+"L"+head[2][0]+","+head[2][1];
  //         // arc.outerRadius(radiusScale(+d.value.maxTotal));
  //         // return arc({endAngle: +getPercentType("gender",d.value.yearMap.get(2014)) * tau});
  //       })
  //       .attr("stroke-width",function(d){
  //         // return lineWidthScale(d.value.maxTotal)
  //         return 1.4;
  //       })
  //       .attr("stroke",function(d){
  //         if(d.value.diff > 0){
  //           return "#3989cb"
  //         }
  //         return "rgb(214, 84, 84)";
  //       })
  //       .on("mouseover",function(d){
  //         console.log(d.value.diff);
  //         console.log(newsIDName.get(d.key).Company);
  //       })
  //       ;
  //
  //   // var arrowMaps = mapSvg.append("g")
  //   //     .selectAll("g")
  //   //     .data(newsNest)
  //   //     .enter()
  //   //     .append("g")
  //   //     .attr("transform",function(d){
  //   //       var location = d.value.location;
  //   //       return "translate("+projection([+location.lng,location.lat])+")";
  //   //     })
  //   //     .append("path")
  //   //     .attr("transform",function(d){
  //   //       return "translate("+ Math.random()*5+","+Math.random()*5+")";
  //   //     })
  //   //     .attr("class","map-arrow-path-peak")
  //   //     .attr("d", function(d){
  //   //
  //   //       //height = size
  //   //       //left / right = margin
  //   //
  //   //       var offset = radiusScale(d.value.maxTotal);
  //   //
  //   //       // var xVal = xArrowLength(Math.abs(d.value.diff));
  //   //
  //   //       xArrowLength.range([0,offset*3])
  //   //       var xVal = xArrowLength(Math.abs(d.value.diff));
  //   //
  //   //       var dx = 0;
  //   //       if(d.value.diff > 0){
  //   //         dx = xVal;
  //   //       }
  //   //       else{
  //   //         dx = -xVal;
  //   //       }
  //   //       var dy = -3;
  //   //
  //   //       return "M"+ -offset +","+ 0 + "L"+0+","+ -dx +"L"+offset+","+0// [-offset,0][0,dx][offset,0]
  //   //
  //   //       // return "M0,"+ -offset + "L"+dx+","+"0"+"L"+0+","+offset// [0,-offset][xVal,0][0,offset]
  //   //
  //   //
  //   //       var stemLen = Math.sqrt(dx * dx + dy * dy);
  //   //       var headLen = Math.min(stemLen * 0.7, 8);
  //   //       var xn = dx / stemLen * headLen;
  //   //       var yn = dy / stemLen * headLen;
  //   //       var ax1 = xn * cos1 - yn * sin1 + dx
  //   //       var ay1 = xn * sin1 + yn * cos1 + dy
  //   //       var ax2 = xn * cos2 - yn * sin2 + dx
  //   //       var ay2 = xn * sin2 + yn * cos2 + dy
  //   //
  //   //       var head = [[ax1,ay1],[dx,dy],[ax2,ay2]];
  //   //
  //   //       return "M0,0"+"L"+dx+","+dy+"L"+head[0][0]+","+head[0][1]+"L"+head[1][0]+","+head[1][1]+"L"+head[2][0]+","+head[2][1];
  //   //       // arc.outerRadius(radiusScale(+d.value.maxTotal));
  //   //       // return arc({endAngle: +getPercentType("gender",d.value.yearMap.get(2014)) * tau});
  //   //     })
  //   //     .attr("stroke-width",function(d){
  //   //       return lineWidthScale(d.value.maxTotal)
  //   //       // return 1.4;
  //   //     })
  //   //     .attr("stroke",function(d){
  //   //       if(d.value.diff > 0){
  //   //         return "#3989cb"
  //   //       }
  //   //       return "rgb(214, 84, 84)";
  //   //     })
  //   //     .on("mouseover",function(d){
  //   //       console.log(d.value.diff);
  //   //       console.log(newsIDName.get(d.key).Company);
  //   //     })
  //   //     ;
  //
  //
  //   // var pieChartBackground = mapSvg.append("g")
  //   //   .attr("class","map-markers")
  //   //   .selectAll("circle")
  //   //   .data(newsNest)
  //   //   .enter()
  //   //   .append("circle")
  //   //   .attr("class","map-marker")
  //   //   .attr("r",function(d){
  //   //     return radiusScale(+d.value.maxTotal);
  //   //   })
  //   //   .style("fill",function(d){
  //   //     //     var t0 = yScale(getPercentType("gender",d.value.values[0]))
  //   //     //     var t1 = yScale(getPercentType("gender",d.value.yearMap.get(2014)))
  //   //
  //   //     // return colorScalePercent(getPercentType("gender",d.value.yearMap.get(2014)))
  //   //     return "#72c1ff"
  //   //   })
  //   //   .attr("transform",function(d){
  //   //     var location = d.value.location;
  //   //     return "translate("+projection([+location.lng,location.lat])+")";
  //   //   })
  //   //   .on("mouseover",function(d){
  //   //     // console.log(d);
  //   //     console.log(newsIDName.get(d.key).Company);
  //   //     console.log(getPercentType("gender",d.value.yearMap.get(2014)));
  //   //   })
  //   //   ;
  //
  //   // var pieCharts = mapSvg.append("g")
  //   //     .selectAll("g")
  //   //     .data(newsNest)
  //   //     .enter()
  //   //     .append("g")
  //   //     .attr("transform",function(d){
  //   //       var location = d.value.location;
  //   //       return "translate("+projection([+location.lng,location.lat])+")";
  //   //     })
  //   //     .append("path")
  //   //     .attr("class","slice-arc")
  //   //     .style("fill",function(d){
  //   //       return "blue"
  //   //       //     var t0 = yScale(getPercentType("gender",d.value.values[0]))
  //   //       //     var t1 = yScale(getPercentType("gender",d.value.yearMap.get(2014)))
  //   //       return colorScalePercent(getPercentType("gender",d.value.yearMap.get(2014)))
  //   //       return "red"
  //   //     })
  //   //     .attr("d", function(d){
  //   //       arc.outerRadius(radiusScale(+d.value.maxTotal));
  //   //       return arc({endAngle: +getPercentType("gender",d.value.yearMap.get(2014)) * tau});
  //   //     });
  //
  //   // function buildAxis(){
  //   //  var chartAxis = chartDiv.append("g")
  //   //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  //   //    .attr("class","swarm-axis")
  //   //    ;
  //   //
  //   //  chartAxis.append("g")
  //   //    .append("line")
  //   //    .attr("x1",0)
  //   //    .attr("x2","100%")
  //   //    .attr("y1",height/2)
  //   //    .attr("y2",height/2)
  //   //    .attr("class","swarm-axis-line")
  //   //
  //   // }
  //   // buildAxis();
  //
  //   // var linearGradientDown = chartSvgDoubleChange
  //   //   .append("defs")
  //   //   .append("linearGradient")
  //   //   .attr("id","gradient")
  //   //   .attr("x1",0)
  //   //   .attr("x2",0)
  //   //   .attr("y1",0)
  //   //   .attr("y2",1)
  //   //
  //   // var linearGradientUp = chartSvgDoubleChange
  //   //   .append("defs")
  //   //   .append("linearGradient")
  //   //   .attr("id","gradient-up")
  //   //   .attr("x1",0)
  //   //   .attr("x2",0)
  //   //   .attr("y1",0)
  //   //   .attr("y2",1)
  //   //
  //   // var chartSvgDoubleChangeG = chartSvgDoubleChange
  //   //   .append("g")
  //   //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //   //
  //   // linearGradientUp
  //   //   .append("stop")
  //   //   .attr("stop-color","blue")
  //   //   .attr("stop-opacity",1)
  //   //
  //   // linearGradientUp
  //   //   .append("stop")
  //   //   .attr("offset","100%")
  //   //   .attr("stop-color","blue")
  //   //   .attr("stop-opacity",0)
  //   //
  //   // linearGradientDown
  //   //   .append("stop")
  //   //   .attr("stop-color","red")
  //   //   .attr("stop-opacity",0)
  //   //
  //   // linearGradientDown
  //   //   .append("stop")
  //   //   .attr("offset","100%")
  //   //   .attr("stop-color","red")
  //   //   .attr("stop-opacity",1)
  //   //
  //   // chartSvgDoubleChangeG.append("marker")
  //   //   .attr("id","triangle-up")
  //   //   .attr("viewBox","0 0 10 10")
  //   //   .attr("refX",0)
  //   //   .attr("refY",5)
  //   //   .attr("markerUnits","strokeWidth")
  //   //   .attr("markerWidth",6)
  //   //   .attr("markerHeight",8)
  //   //   .attr("orient","auto")
  //   //   .append("path")
  //   //   .attr("fill","blue")
  //   //   .attr("d","M 0 0 L 10 5 L 0 10 z")
  //   //
  //   // chartSvgDoubleChangeG.append("marker")
  //   //   .attr("id","triangle-down")
  //   //   .attr("viewBox","0 0 10 10")
  //   //   .attr("refX",0)
  //   //   .attr("refY",5)
  //   //   .attr("markerUnits","strokeWidth")
  //   //   .attr("markerWidth",6)
  //   //   .attr("markerHeight",8)
  //   //   .attr("orient","auto")
  //   //   .append("path")
  //   //   .attr("fill","red")
  //   //   .attr("d","M 0 0 L 10 5 L 0 10 z")
  //   //
  //   //
	// 	// function drawArrow (t0,t1) {
	// 	// 	var d = t1 > t0 ?
	// 	// 		("M0," + (t1-2) + " L4," + (t1-8) + " L1.5," + (t1-8) + " L0," + t0 + " L-1.5," + (t1-8) + " L-4," + (t1-8) + " Z") :
	// 	// 		("M0," + (t1+2) + " L4," + (t1+8) + " L1.5," + (t1+8) + " L0," + t0 + " L-1.5," + (t1+8) + " L-4," + (t1+8) + " Z");
  //   //
	// 	// 	return d;
	// 	// }
  //   //
  //   // var arrows = chartSvgDoubleChangeG
  //   //   .selectAll("path")
  //   //   .data(newsNest)
  //   //   .enter()
  //   //   .append("path")
  //   //   .attr("class","arrow-scatter-line")
  //   //   .attr("d",function(d){
  //   //     var t0 = yScale(getPercentType("gender",d.value.values[0]))
  //   //     var t1 = yScale(getPercentType("gender",d.value.yearMap.get(2014)))
  //   //     // return null
  //   //     //
  //   //     return drawArrow(t0,t1)
  //   //   })
  //   //   .attr("fill",function(d){
  //   //     if(d.value.diff > 0){
  //   //       return "url(#gradient-up)"
  //   //     }
  //   //     return "url(#gradient)";
  //   //   })
  //   //   .attr("stroke","none")
  //   //   .attr("fill-opacity",1)
  //   //
  //   // var arrowXScale = d3.scaleLinear().domain([0,arrows.size()-1]).range([0,width]);
  //   //
  //   // arrows
  //   //   .sort(function(a,b){
  //   //     // return getPercentType("gender",b.value.values[0]) - getPercentType("gender",a.value.values[0])
  //   //     return b.value.diff - a.value.diff;
  //   //   })
  //   //   .attr("transform",function(d,i){
  //   //     return "translate("+arrowXScale(i)+",0)"
  //   //     // return "translate("+totalXScale(d.value.yearMap.get(2014).total_num)+",0)"
  //   //   })
  //   //   .on("mouseover",function(d){
  //   //     console.log(getPercentType("supGender",d.value.yearMap.get(2014)),getPercentType("gender",d.value.yearMap.get(2014)));
  //   //   })
  //   //   ;
  //
  //
  //   // chartSvgDoubleChangeG
  //   //   .selectAll("line")
  //   //   .data(newsNest)
  //   //   .enter()
  //   //   .append("line")
  //   //   .attr("class","arrow-scatter-line")
  //   //   .style("stroke-width",function(d){
  //   //     if(+d.value.yearMap.get(2014).total_num > 100){
  //   //       return "2px"
  //   //     }
  //   //     if(+d.value.yearMap.get(2014).total_num > 50){
  //   //       return "1px"
  //   //     }
  //   //     if(+d.value.yearMap.get(2014).total_num > 10){
  //   //       return ".5px"
  //   //     }
  //   //   })
  //   //   .style("stroke",function(d){
  //   //     if(d.value.diff > 0){
  //   //       return "blue"
  //   //     }
  //   //     return "red"
  //   //   })
  //   //   .attr("x1",function(d){
  //   //     return xScale(getPercentType("supGender",d.value.values[0]));
  //   //   })
  //   //   .attr("x2", function(d) {
  //   //     return xScale(getPercentType("supGender",d.value.yearMap.get(2014)));
  //   //     // return diffScale(d.value.diff);
  //   //   })
  //   //   .attr("y1",function(d){
  //   //     return totalScale(d.value.yearMap.get(2014).total_num)
  //   //     // return yScale(getPercentType("supGender",d.value.values[0]));
  //   //   })
  //   //   .attr("y2", function(d) {
  //   //     return totalScale(d.value.yearMap.get(2014).total_num)
  //   //     // return yScale(getPercentType("supGender",d.value.yearMap.get(2014)));
  //   //     // return raceDiffScale(d.value.raceDiff)
  //   //   })
  //   //   .attr("marker-end",function(d){
  //   //     if(d.value.diff > 0){
  //   //       return "url(#triangle-up)";
  //   //     }
  //   //     return "url(#triangle-down)";
  //   //   })
  //   //   // .style("stroke","url(#gradient)")
  //   //   .on("mouseover",function(d){
  //   //     console.log(getPercentType("supGender",d.value.yearMap.get(2014)),getPercentType("gender",d.value.yearMap.get(2014)));
  //   //   })
  //   //   ;
  //
  //   // chartSvgDoubleChangeG
  //   //   .append("line")
  //   //   .attr("class","arrow-scatter-line-axis")
  //   //   .attr("x1",function(d){
  //   //     return xScale(.5);
  //   //   })
  //   //   .attr("x2", function(d) {
  //   //     return xScale(.5);
  //   //   })
  //   //   .attr("y1",function(d){
  //   //     return 0;
  //   //   })
  //   //   .attr("y2", function(d) {
  //   //     return height;
  //   //   })
  //
  //   // chartSvgDoubleChangeG
  //   //   .append("line")
  //   //   .attr("class","arrow-scatter-line-axis")
  //   //   .attr("x1",function(d){
  //   //     return 0;
  //   //   })
  //   //   .attr("x2", function(d) {
  //   //     return width;
  //   //   })
  //   //   .attr("y1",function(d){
  //   //     return yScale(.5);
  //   //   })
  //   //   .attr("y2", function(d) {
  //   //     return yScale(.5);
  //   //   })
  //
  //
  //   // function buildAverage(){
  //   //   var chartAverage = chartDiv.append("g")
  //   //      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  //   //      .attr("class","swarm-average")
  //   //      ;
  //   //
  //   //  chartAverage.append("text")
  //   //    .attr("class","swarm-average-text swarm-average-text-label")
  //   //    .attr("x",xScale(dataToMap.average))
  //   //    .attr("y",height*.33-19)
  //   //    .text("Overall")
  //   //
  //   //   chartAverage.append("text")
  //   //     .attr("class","swarm-average-text")
  //   //     .attr("x",xScale(dataToMap.average))
  //   //     .attr("y",height*.33-5)
  //   //     .text(Math.round(dataToMap.average*100)+"% Male")
  //   //
  //   //   chartAverage.append("line")
  //   //     .attr("class","swarm-average-line")
  //   //     .attr("x1",xScale(dataToMap.average))
  //   //     .attr("x2",xScale(dataToMap.average))
  //   //     .attr("y1",height*.33)
  //   //     .attr("y2",height*.66)
  //   //     ;
  //   // }
  //   // buildAverage();
  //
  //   // var topRowCircle = chartG
  //   //   .append("g")
  //   //   .selectAll("circle")
  //   //   .data(newsNest)
  //   //   .enter()
  //   //   .append("circle")
  //   //   .attr("class","swarm-circle")
  //   //   .attr("r", function(d){
  //   //     return 3
  //   //   })
  //   //   .attr("cx", function(d) {
  //   //     return xScale(getPercent(d.value.yearMap.get(2014)));
  //   //   })
  //   //   .attr("cy", function(d) {
  //   //     return 0;
  //   //   })
  //   //   .style("fill",function(d){
  //   //     var diff = getPercent(d.value.yearMap.get(2014))-getPercent(d.value.values[0])
  //   //     if(diff > .01){
  //   //       return "red"
  //   //     }
  //   //     if(diff < .01){
  //   //       return "green";
  //   //     }
  //   //   })
  //   //   .on("mouseover",function(d){
  //   //     console.log(d);
  //   //   })
  //   //   ;
  //   //
  //   // var bottomRowCircle = chartG
  //   //   .append("g")
  //   //   .selectAll("circle")
  //   //   .data(newsNest)
  //   //   .enter()
  //   //   .append("circle")
  //   //   .attr("class","swarm-circle")
  //   //   .attr("r", function(d){
  //   //     return 3
  //   //   })
  //   //   .attr("cx", function(d) {
  //   //     return xScale(getPercent(d.value.values[0]));
  //   //   })
  //   //   .attr("cy", function(d) {
  //   //     return 100;
  //   //   })
  //   //   .style("fill",function(d){
  //   //     var diff = getPercent(d.value.yearMap.get(2014))-getPercent(d.value.values[0])
  //   //     if(diff > .01){
  //   //       return "red"
  //   //     }
  //   //     if(diff < .01){
  //   //       return "green";
  //   //     }
  //   //   })
  //   //   ;
  //   //
  //   // var rowLines = chartG
  //   //   .append("g")
  //   //   .selectAll("line")
  //   //   .data(newsNest)
  //   //   .enter()
  //   //   .append("line")
  //   //   .attr("class","slope-line")
  //   //   .attr("x2", function(d) {
  //   //     return xScale(getPercent(d.value.values[0]));
  //   //   })
  //   //   .attr("y2", function(d) {
  //   //     return 100;
  //   //   })
  //   //   .attr("x1", function(d) {
  //   //     return xScale(getPercent(d.value.yearMap.get(2014)));
  //   //   })
  //   //   .attr("y1", function(d) {
  //   //     return 0;
  //   //   })
  //   //   .style("stroke",function(d){
  //   //     var diff = getPercent(d.value.yearMap.get(2014))-getPercent(d.value.values[0])
  //   //     if(diff > .01){
  //   //       return "red"
  //   //     }
  //   //     if(diff < .01){
  //   //       return "green";
  //   //     }
  //   //   })
  //   //   ;
  //   //
  //   // var miniWidth = 40;
  //   // var miniHeight = 100;
  //   //
  //   // var multipleY = d3.scaleLinear().domain([.3,1]).range([miniHeight,0]);
  //   //
  //   // var miniMultipleWrapper = miniMultiple.selectAll("div")
  //   //   .data(newsNest)
  //   //   .enter()
  //   //   .append("div")
  //   //   .attr("class","mini-multiple-div")
  //   //   ;
  //   //
  //   // miniMultipleWrapper.append("p")
  //   //   .attr("class","mini-multiple-text")
  //   //   .style("margin-top",20)
  //   //   .text(function(d){
  //   //     return newsIDName.get(d.value.values[0].NewsID).Company;
  //   //   })
  //   //   ;
  //   //
  //   // var miniMultipleWrapperSvg = miniMultipleWrapper
  //   //   .append("svg")
  //   //   .attr("class","slope-mini-svg")
  //   //   .attr("height",miniHeight)
  //   //   .style("height",miniHeight+"px")
  //   //   ;
  //   //
  //   // miniMultipleWrapperSvg
  //   //   .append("circle")
  //   //   .attr("cx",function(d){
  //   //     return 0;
  //   //   })
  //   //   .attr("cy",function(d){
  //   //     return multipleY(getPercent(d.value.values[0]));
  //   //   })
  //   //   .attr("r",2)
  //   //   .attr("class","slope-small-dot")
  //   //   .style("fill",function(d){
  //   //
  //   //     console.log(newsIDName.get(d.key).Company);
  //   //     console.log(getPercent(d.value.yearMap.get(2014)));
  //   //     console.log(getPercent(d.value.values[0]));
  //   //
  //   //     var diff = getPercent(d.value.yearMap.get(2014))-getPercent(d.value.values[0])
  //   //     if(diff > .01){
  //   //       return "red"
  //   //     }
  //   //     if(diff < .01){
  //   //       return "green";
  //   //     }
  //   //   })
  //   //   ;
  //   //
  //   // miniMultipleWrapperSvg
  //   //   .append("circle")
  //   //   .attr("cx",function(d){
  //   //     return miniWidth;
  //   //   })
  //   //   .attr("cy",function(d){
  //   //     return multipleY(getPercent(d.value.yearMap.get(2014)));
  //   //   })
  //   //   .attr("r",2)
  //   //   .attr("class","slope-small-dot")
  //   //   .style("fill",function(d){
  //   //     var diff = getPercent(d.value.yearMap.get(2014))-getPercent(d.value.values[0])
  //   //     if(diff > .01){
  //   //       return "red"
  //   //     }
  //   //     if(diff < .01){
  //   //       return "green";
  //   //     }
  //   //   })
  //   //   ;
  //   //
  //   // miniMultipleWrapperSvg
  //   //   .selectAll("line")
  //   //   .data([0,1,2,4,5])
  //   //   .enter()
  //   //   .append("line")
  //   //   .attr("class","slope-line-axis")
  //   //   .attr("y1", function(d,i) {
  //   //     return i*20+"%";
  //   //   })
  //   //   .attr("x1", function(d) {
  //   //     return 0;
  //   //   })
  //   //   .attr("y2", function(d,i) {
  //   //     return i*20+"%";
  //   //   })
  //   //   .attr("x2", function(d) {
  //   //     return miniWidth;
  //   //   })
  //   //
  //   // miniMultipleWrapperSvg
  //   //   .append("line")
  //   //   .attr("class","slope-line")
  //   //   .attr("y1", function(d) {
  //   //     return multipleY(getPercent(d.value.values[0]));
  //   //   })
  //   //   .attr("x1", function(d) {
  //   //     return 0;
  //   //   })
  //   //   .attr("y2", function(d) {
  //   //     return multipleY(getPercent(d.value.yearMap.get(2014)));
  //   //   })
  //   //   .attr("x2", function(d) {
  //   //     return miniWidth;
  //   //   })
  //   //   .style("stroke",function(d){
  //   //     var diff = getPercent(d.value.yearMap.get(2014))-getPercent(d.value.values[0])
  //   //     if(diff > .01){
  //   //       return "red"
  //   //     }
  //   //     if(diff < .01){
  //   //       return "green";
  //   //     }
  //   //   })
  //   //   ;
  //   //
  //
  //   // cell
  //   //   .append("circle")
  //   //   .attr("class","swarm-circle")
  //   //   .attr("r", function(d){
  //   //     return d.radius
  //   //   })
  //   //   // .attr("cx", function(d) { return d.x; })
  //   //   // .attr("cy", function(d) { return d.y; })
  //   //   .on("mouseover",function(d){
  //   //     console.log(d.male_num/d.total_num);
  //   //     console.log(newsIDName.get(d.NewsID).Company);
  //   //   })
  //   //   ;
  //
  //   // dataToMap.values = d3.nest()
  //   //   .key(function(d){
  //   //     return Math.round(getPercent(d)*50)/50;
  //   //   })
  //   //   .sortKeys(function(a,b){
  //   //     return a-b;
  //   //   })
  //   //   .entries(dataToMap.values)
  //   //   ;
  //   //
  //   // chartDiv.append("div")
  //   //   .attr("class","histogram-avg-div")
  //   //   .style("left",function(d){
  //   //     return (dataToMap.average*width+1)+"px"
  //   //   })
  //   //   .append("p")
  //   //   .text(Math.round(dataToMap.average*100)+"%")
  //   //   ;
  //   //
  //   // var yearsColumn = chartDiv
  //   //   .selectAll(".histogram-year-container")
  //   //   .data(dataToMap.values)
  //   //   .enter()
  //   //   .append("div")
  //   //   .attr("class","histogram-year-container")
  //   //   .style("left",function(d){
  //   //     return (d.key*width+1)+"px"
  //   //   })
  //   //   ;
  //   //
  //   // yearsColumn
  //   //   .selectAll("div")
  //   //   .data(function(d){
  //   //     return d.values
  //   //   })
  //   //   .enter()
  //   //   .append("div")
  //   //   .attr("class",function(d){
  //   //     var state = null;
  //   //     var region = null;
  //   //     if(newsIdMap.has(d.NewsID)){
  //   //       state = newsIdMap.get(d.NewsID).State;
  //   //     }
  //   //     if(regionMap.has(state)){
  //   //       region = regionMap.get(state)[3];
  //   //     }
  //   //
  //   //     if(region =="West"){
  //   //       region = "green"
  //   //     }
  //   //     if(region =="South"){
  //   //       region = "blue"
  //   //     }
  //   //     if(region =="Midwest"){
  //   //       region = "purple"
  //   //     }
  //   //     if(region =="Northeast"){
  //   //       region = "yellow"
  //   //     }
  //   //     return "histogram-year-item "+region
  //   //   })
  //   //   .style("background-color",function(d){
  //   //     // return backgroundFunction(d)
  //   //     return null
  //   //   })
  //   //   .on("mouseover",function(d){
  //   //     console.log(newsIDName.get(d.NewsID).Company);
  //   //   })
  //   //   ;
  //   //
  //   // yearsColumn.append("p")
  //   //   .text(function(d,i){
  //   //     if(i%5 == 0 || i==0 || i==yearsColumn.size()-1){
  //   //       return Math.round(d.key*100)+"%";
  //   //     }
  //   //     return null;
  //   //
  //   //   })
  //   //   ;
  // }
  // // function backgroundFunction(d){
  // //   var state = null;
  // //   var region = null;
  // //   if(newsIdMap.has(d.NewsID)){
  // //     state = newsIdMap.get(d.NewsID).State;
  // //   }
  // //   if(regionMap.has(state)){
  // //     region = regionMap.get(state)[3];
  // //   }
  // //   if(region =="West"){
  // //     return "green"
  // //   }
  // //   if(region =="South"){
  // //     return "blue"
  // //   }
  // //   if(region =="Midwest"){
  // //     return "purple"
  // //   }
  // //   if(region =="Northeast"){
  // //     return "yellow"
  // //   }
  // // }
  // buildChart();

}

export default { init }
