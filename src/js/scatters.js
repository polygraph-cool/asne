
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

function init(mapData,latLongData,newsIDLocation,newsIDInfo) {

	var cut = "gender"
	// var cut = "supGender"
  var countMin =  100;

	function getAverage(data){
		if(cut == "gender"){
      var mean = d3.mean(data,function(d){return +(data.total_num-data.male_num)/data.total_num});
			return mean;
		}
		if(cut == "supWhite"){
			return d3.mean(data,function(d){return +data.white_sup_num/data.total_sup_num});
		}
		if(cut == "supGender"){
			return d3.mean(data,function(d){return (+data.total_sup_num - +data.male_sup_num)/data.total_sup_num});
		}
		return d3.mean(data,function(d){return +data.white_num/data.total_num});
	}

	function getPercent(data){
		if(cut == "gender"){
			return +(data.total_num-data.male_num)/data.total_num
		}
		if(cut == "supWhite"){
			return +data.white_sup_num/data.total_sup_num;
		}
		if(cut == "supGender"){
			return +data.male_sup_num/data.total_sup_num;
		}
		return (+data.total_num - +data.white_num)/data.total_num
	}

  function getPercentType(kind,data){
    if(kind == "gender"){
      return +(data.total_num-data.male_num)/data.total_num
    }
    if(kind == "supWhite"){
      return +data.white_sup_num/data.total_sup_num;
    }
    if(kind == "supGender"){
      return (+data.total_sup_num - +data.male_sup_num)/data.total_sup_num;
    }
    return (+data.total_num - +data.white_num)/data.total_num
  }

	var latLongMap = d3.map(latLongData,function(d){ return d.NewsID});
	var newsIdMap = d3.map(newsIDLocation,function(d){ return d.NewsID});
  var newsIDName = d3.map(newsIDInfo,function(d){ return d.NewsID});
	var regionMap = d3.map(states,function(d){
		return d[1];
	});

  var margin = {top: 40, right: 40, bottom: 40, left: 40};
	var width = 500 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
	var horzScale = d3.scaleLinear().domain([0,1]).range([0,width])
	var container = d3.select(".scatter");


  container.append("p")
    .attr("class","chart-title")
    .text("Gender Break-down of Staff vs. Leaders")
    ;

  function buildToggles(){
    var toggles = container.append("div")
      .attr("class","histogram-chart-toggle-wrapper");

    var sizeCats = [0,20,50,100,500];

    toggles
      .append("div")
      .attr("class","histogram-chart-toggle-size")
      .selectAll("p")
      .data(sizeCats)
      .enter()
      .append("p")
      .attr("class",function(d,i){
        if(i==0){
          return "toggle-selected front-curve histogram-chart-toggle-item";
        }
        if(i==sizeCats.length-1){
          return "back-curve histogram-chart-toggle-item";
        }
        return "histogram-chart-toggle-item";
      })
      .text(function(d){
        return d;
      })
      .on("click",function(d){
        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
          if(d==dataSelected){
            return true;
          }
          return false;
        })
        countMin = d;
        buildChart();
      })
      ;

    var raceGenderToggleData = ["gender","race"];//,"supWhite","supGender"]

    toggles
      .append("div")
      .attr("class","histogram-chart-toggle-type")
      .selectAll("p")
      .data(raceGenderToggleData)
      .enter()
      .append("p")
      .attr("class",function(d,i){
        if(i==0){
          return "toggle-selected front-curve histogram-chart-toggle-item";
        }
        if(i==raceGenderToggleData.length-1){
          return "back-curve histogram-chart-toggle-item";
        }
        return "histogram-chart-toggle-item";
      })
      .text(function(d){
        if(d=="race"){
          return "Race"
        }
        return "Gender";
      })
      .on("click",function(d){
        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
          if(d==dataSelected){
            return true;
          }
          return false;
        })
        cut = d;
        buildChart();
      })
      ;

    var leaderToggleData = ["all","leader"];

    toggles
      .append("div")
      .attr("class","histogram-chart-toggle-type")
      .selectAll("p")
      .data(leaderToggleData)
      .enter()
      .append("p")
      .attr("class",function(d,i){
        if(i==0){
          return "toggle-selected front-curve histogram-chart-toggle-item";
        }
        if(i==leaderToggleData.length-1){
          return "back-curve histogram-chart-toggle-item";
        }
        return "histogram-chart-toggle-item";
      })
      .text(function(d){
        if(d=="all"){
          return "All Staff"
        }
        return "Leadership";
      })
      .on("click",function(d){
        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
          if(d==dataSelected){
            return true;
          }
          return false;
        })
        group = d;
        buildChart();
      })
      ;
  }
  buildToggles()


  function buildChart(){

    d3.selectAll(".scatter-chart-wrapper").remove();

    var chartDiv = container
      .append("div")
      .attr("class","scatter-chart-wrapper")
      .style("width",width+margin.left+margin.right+"px")
      ;

    var chartSvgDoubleChange = chartDiv
      .append("svg")
      .attr("class","scatter-chart-wrapper-svg-double-change")
      .attr("width",width+margin.left+margin.right)
      .attr("height",height+margin.top+margin.bottom)
      .style("width",width+margin.left+margin.right+"px")
      .style("height",height+margin.top+margin.bottom+"px")
      ;

    var filteredMapData = mapData.filter(function(d){
        if(cut == "supWhite" || cut == "supGender"){
          return d.total_num > countMin && d.total_sup_num > 0;
        }
        return d.total_num > countMin;
      })
      ;

    var maxPercentArray = [];
    var diffArray = [];
    var raceDiffArray = []
    var newsNest = d3.nest()
      .key(function(d){
        return +d.NewsID
      })
      .rollup(function(leaves){
        var map = d3.map(leaves,function(d){return d.Year});
        var maxTotalNum = d3.max(leaves,function(d){return d.total_num});
        var maxPercent = d3.max(leaves,function(d){ return getPercent(d)});
        maxPercentArray.push(maxPercent)
        return {yearMap:map,values:leaves,maxTotal:maxTotalNum}
      })
      .entries(filteredMapData)
      ;

    newsNest = newsNest.filter(function(d){
      if(d.value.yearMap.has(2014)){
        return d;
      }
      return null;
    });

    for (var item in newsNest){
      var diff = getPercent(newsNest[item].value.yearMap.get(2014))-getPercent(newsNest[item].value.values[0])
      cut = "supGender";
      var raceDiff = getPercent(newsNest[item].value.yearMap.get(2014))-getPercent(newsNest[item].value.values[0]);
      cut = "gender"
      diffArray.push(diff);
      raceDiffArray.push(raceDiff);
      newsNest[item].value.companyName = newsIDName.get(newsNest[item].key).Company
      newsNest[item].value.diff = diff;
      newsNest[item].value.raceDiff = raceDiff;
    }
    ;

    var totalExtent = d3.extent(newsNest,function(d){return +d.value.maxTotal})
    var radiusScale = d3.scaleLinear().domain(totalExtent).range([5,30]);
    var percentExtent = d3.extent(maxPercentArray,function(d){return d;});
    var diffExtent = d3.extent(diffArray,function(d){return d; });
    var raceDiffExtent = d3.extent(raceDiffArray,function(d){ return d; });
    var diffScale = d3.scaleLinear().domain([diffExtent[0],diffExtent[1]]).range([0,width])
    var raceDiffScale = d3.scaleLinear().domain([raceDiffExtent[0],raceDiffExtent[1]]).range([height,0])

    var colorScale = d3.scaleLinear().domain([diffExtent[0],0,diffExtent[1]]).range(["red","white","green"]);
    var strokeScale = d3.scaleLinear().domain([diffExtent[0],0,diffExtent[1]]).range(["red","grey","green"]);

    var xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
    var yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);

    function buildAxis(){
     var chartAxis = chartSvgDoubleChange.append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
       .attr("class","swarm-axis")
       ;

    var chartAxisLines = chartAxis.append("g")

    chartAxisLines.append("line")
      .attr("x1",width/2)
      .attr("x2",width/2)
      .attr("y1",0)
      .attr("y2",height)
      .attr("class","swarm-axis-line")

    chartAxisLines.append("g")
       .append("line")
       .attr("x1",0)
       .attr("x2",width)
       .attr("y1",height/2)
       .attr("y2",height/2)
       .attr("class","swarm-axis-line")

     var chartAxisText = chartAxis.append("g")

     chartAxisText
       .append("g")
       .selectAll("text")
       .data(["100% Female Leaders","100% Male Leaders"])
       .enter()
       .append("text")
       .attr("x",function(d,i){
         return width/2;
       })
       .attr("y",function(d,i){
         if(i==0){
           return 0;
         }
         return height
       })
       .attr("class","swarm-axis-tick-text")
       .text(function(d){
         return d;
       })
       .style("text-anchor",function(d,i){
         return "middle"
       })
       .style("dominant-baseline","text-after-edge")
       ;

     chartAxisText
       .append("g")
       .selectAll("text")
       .data(["100% Male Staff","100% Female Staff"])
       .enter()
       .append("text")
       .attr("x",function(d,i){
         if(i==0){
           return 0
         }
         return width
       })
       .attr("y",height/2)
       .attr("class","swarm-axis-tick-text")
       .text(function(d){
         return d;
       })
       .style("text-anchor",function(d,i){
         if(i==0){
           return "end";
         }
         return "start"
       })
       ;

    }
    buildAxis();

    var chartSvgDoubleChangeG = chartSvgDoubleChange
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chartSvgDoubleChangeG
      .selectAll("circle")
      .data(newsNest)
      .enter()
      .append("circle")
      .attr("class","scatter-circle-double-axis")
      .attr("r", function(d){
        return radiusScale(d.value.yearMap.get(2014).total_num);
      })
      .attr("cx", function(d) {
        return xScale(getPercentType("gender",d.value.yearMap.get(2014)));
        return diffScale(d.value.diff);
      })
      .attr("cy", function(d) {
        return yScale(getPercentType("supGender",d.value.yearMap.get(2014)));
      })
      .on("mouseover",function(d){
      })
      ;

    chartDiv.append("div")
      .attr("class","swarm-chart-logos")
      .style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
      .selectAll("div")
      .data(newsNest)
      .enter()
      .append("div")
      .style("transform",function(d){
         return "translate(" + xScale(getPercentType("gender",d.value.yearMap.get(2014)))+"px" + "," + yScale(getPercentType("supGender",d.value.yearMap.get(2014)))+"px" + ")"
      })
      .attr("class","swarm-chart-logo-container")
      .append("div")
      .style("width", function(d){
        return "1px"
      })
      .style("height", function(d){
        return "1px"
      })
      .attr("class","swarm-chart-logo")
      .style("width", function(d){
        return radiusScale(d.value.yearMap.get(2014).total_num)*2+"px"
      })
      .style("height", function(d){
        return radiusScale(d.value.yearMap.get(2014).total_num)*2+"px"
      })
      .style("background-image",function(d){
        if(d.value.companyName=="the new york times"){
          return "url(assets/ny-times-logo.svg)"
        }
      })
      ;


  }
  buildChart();

}

export default { init }
