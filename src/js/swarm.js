
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
  var group = "all"
  var countMin =  50;

	function getAverage(data){

		if(cut == "gender" && group == "all"){
			return d3.mean(data,function(d){return (d.total_num - d.male_num)/(d.total_num)});
		}
		if(cut == "race" && group != "all"){
			return d3.mean(data,function(d){return (+d.total_sup_num - +d.white_sup_num)/d.total_sup_num});
		}
		if(cut == "gender" && group != "all"){
			return d3.mean(data,function(d){return (+d.total_sup_num - +d.male_sup_num)/d.total_sup_num});
		}
		return d3.mean(data,function(d){return (+d.total_num - +d.white_num)/d.total_num});
	}

	function getPercent(data){
    if(cut == "gender" && group == "all"){
      return +(data.total_num-data.male_num)/data.total_num
		}
    if(cut == "race" && group != "all"){
      return (+data.total_sup_num - +data.white_sup_num)/data.total_sup_num;
		}
    if(cut == "gender" && group != "all"){
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

  var margin = {top: 40, right: 40, bottom: 20, left: 40};
	var width = 1000 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;
	var horzScale = d3.scaleLinear().domain([0,1]).range([0,width])
	var container = d3.select(".swarm");

  container.append("p")
    .attr("class","chart-title")
    .text("Newsrooms Broken-down by Gender")
    ;

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

  var xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]);

  function buildChart(){

    if(cut == "race"){
      xScale.domain([0,1]);
    }

    d3.selectAll(".swarm-chart-container").remove();

    var chartDivContainer = container
      .append("div")
      .attr("class","swarm-chart-container")
      .style("width",width+margin.left+margin.right+"px")

    var chartToolTip = chartDivContainer
      .append("div")
      .attr("class","swarm-chart-tool-tip")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .text(function(d){
        return d;
      })
      ;

    var chartDiv = chartDivContainer
      .append("svg")
      .attr("class","swarm-chart-wrapper")
      .attr("width",width+margin.left+margin.right)
      .attr("height",height+margin.top+margin.bottom)
      ;

    var filteredMapData = mapData.filter(function(d){
      if(cut == "supWhite" || cut == "supGender"){
        return d.total_num > countMin && d.total_sup_num > 0;
      }
      return d.total_num > countMin;
    })
    ;

    var yearNest = d3.nest()
      .key(function(d){
        return +d.Year
      })
      .rollup(function(leaves){
        var average = getAverage(leaves);
        return {average:average,values:leaves};
      })

      .entries(filteredMapData)
      ;

    var newsNest = d3.nest()
      .key(function(d){
        return +d.NewsID
      })
      .rollup(function(leaves){
        var map = d3.map(leaves,function(d){return d.Year});
        var maxTotalNum = d3.max(leaves,function(d){return d.total_num});
        return {yearMap:map,values:leaves,maxTotal:maxTotalNum}
      })
      .entries(filteredMapData)
      ;

    var diffArray = [];

    newsNest = newsNest.filter(function(d){
        if(d.value.yearMap.has(2014)){
          return d;
        }
        return null;
      })
      for (var item in newsNest){
        var diff = getPercent(newsNest[item].value.yearMap.get(2014))-getPercent(newsNest[item].value.values[0])
        diffArray.push(diff);
        newsNest[item].value.diff = diff;
      }
      ;

    var newsMap = d3.map(newsNest,function(d){return d.key});

    var diffExtent = d3.extent(diffArray,function(d){return d; });
    var colorScale = d3.scaleLinear().domain(diffExtent).range(["green","red"]);
    var genderColorScale = d3.scaleLinear().domain([.2,.5,.8]).range(["#2161fa","#dddddd","#ff3333"]);
    if(cut == "race"){
      genderColorScale.domain([0,.5,1]);
    }


    var dataToMap = yearNest.filter(function(d){
        return d.key == 2014
      })[0].value;

    var totalExtent = d3.extent(dataToMap.values,function(d){return +d.total_num})
    var radiusScale = d3.scaleLinear().domain(totalExtent).range([5,30]);
    dataToMap.values.forEach(function(d,i){
      d.radius = radiusScale(d.total_num);
    })

    var forceCollide = d3.forceCollide()
        .radius(function(d) { return d.radius + 1; })
        .iterations(1);

    var simulation = d3.forceSimulation(dataToMap.values)
         .force("x", d3.forceX(function(d) { return xScale(getPercent(d)); }).strength(1))
         .force("y", d3.forceY(height / 2))
         .force("collide", forceCollide)
        //  .force("collide", d3.forceCollide(4))
         .stop()
         ;

    function buildAxis(){

     var chartAxis = chartDiv.append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
       .attr("class","swarm-axis")
       ;

     var tickData = [.2,.3,.5,.7,.8];
     if(cut == "race"){
       tickData = [0,.3,.5,.7,1];
     }

     var ticks = chartAxis
       .append("g")
       .attr("class","swarm-axis-tick-container")
       .selectAll("g")
       .data(tickData)
       .enter()
       .append("g")
       .attr("class","swarm-axis-tick-g")
       ;

      ticks
       .append("line")
       .style("stroke",function(d){
         if(d==.5){
           return "#888";
         }
         return genderColorScale(d);
       })
       .attr("x1",function(d){
         return xScale(d);
       })
       .attr("x2",function(d){
         return xScale(d);
       })
       .attr("y1",function(d,i){
         if(d==.5){
           return height/2;
         }
         return 0
       })
       .attr("y2",function(d){
         if(d==.5){
           return 0;
         }
         return height*.05;
       })
       .attr("class","swarm-axis-tick")

     ticks
      .append("text")
      .attr("x",function(d){
        return xScale(d);
      })
      .attr("y",-6)
      .attr("class","swarm-axis-tick-text")
      .style("text-anchor",function(d,i){
        if(i==0){
          return "start"
        }
        if(i==tickData.length-1){
          return "end"
        }
        return null
      })
      .style("fill",function(d,i){
        if(d==.5){
          return "#888";
        }
        return genderColorScale(d);
      })
      .text(function(d,i){
        if(i==0){
          if(cut == "race"){
            return Math.floor((1-d)*100)+"% White Staff"
          }
          return Math.floor((1-d)*100)+"% Male Staff"
        }
        if(i==tickData.length-1){
          if(cut == "race"){
            return Math.floor(d*100)+"% Non-White Staff"
          }
          return Math.floor(d*100)+"% Female Staff"
        }
        if(d==.5){
          return "50/50  Split";
        }
        if(d<.5){
          return Math.floor((1-d)*100)+"%";
        }
        return Math.floor(d*100)+"%";
      })
      ;

     chartAxis.append("g")
       .append("line")
       .attr("x1",0)
       .attr("x2",width)
       .attr("y1",height/2)
       .attr("y2",height/2)
       .attr("class","swarm-axis-line")

    }
    buildAxis();

    var chartG = chartDiv
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function buildAverage(){
      var chartAverage = chartDiv.append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
         .attr("class","swarm-average")
         ;

     chartAverage.append("text")
       .attr("class","swarm-average-text swarm-average-text-label")
       .attr("x",xScale(dataToMap.average))
       .attr("y",height*.2-22)
       .text("Overall")

      chartAverage.append("text")
        .attr("class","swarm-average-text")
        .attr("x",xScale(dataToMap.average))
        .attr("y",height*.2-7)
        .text(function(){
          if(cut == "race"){
            return Math.round((1-dataToMap.average)*100)+"% White"
          }
          return Math.round((1-dataToMap.average)*100)+"% Male"
        })

      chartAverage.append("line")
        .attr("class","swarm-average-line")
        .attr("x1",xScale(dataToMap.average))
        .attr("x2",xScale(dataToMap.average))
        .attr("y1",height*.2)
        .attr("y2",height*.8)
        ;

    }
    buildAverage();

    for (var i = 0; i < 250; ++i) simulation.tick();

    var cell = chartG
      .selectAll("g")
      .data(dataToMap.values)
      .enter()
      .append("g");

    cell
      .append("circle")
      .attr("class","swarm-circle")
      .attr("r", function(d){
        return d.radius
      })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

      .on("mouseover",function(d){
        var data = d;
        chartToolTip
          .style("visibility","visible")
          .style("top",data.y + data.radius +"px")
          .style("left",data.x + data.radius + 50 +"px")
          .text(newsIDName.get(d.NewsID).Company+" - "+Math.floor(getPercent(d)*100)+"%");
      })
      .on("mouseout",function(d){
        chartToolTip
          .style("visibility",null)
          .text("")
          ;
      })
      .style("fill",function(d){
        var value = getPercent(d);
        return genderColorScale(value);
        return colorScale(newsMap.get(d.NewsID).value.diff);
      })
      ;

    // function searchSpectrum(){
    //
    //   var searchArray = [];
    //   var searchResults = d3.selectAll(".search-results");
    //   var searchResultMouseOver = false;
    //
    //   var searchInput = d3.selectAll(".search-films").select("input")
    //         .on("keyup", keyupedFilmColumn);
    //
    //   function keyupedFilmColumn() {
    //     searchFilmColumn(this.value.trim());
    //   }
    //
    //   function searchFilmColumn(value) {
    //     if (value.length > 2) {
    //       searchResults.style("display","block");
    //       var re = new RegExp("\\b" + d3.requote(value), "i");
    //       genreSelected = "all";
    //       var filteredSpectrumData = spectrumData.filter(function(d,i){
    //         var string = d.genreList;
    //         if(genreSelected == "all" && stage == 3){
    //           return +d.gross > 45;
    //         }
    //         else if(genreSelected =="all" && stage == 2){
    //           return d;
    //         }
    //         else if(stage == 3){
    //           var substring = genreSelected;
    //           return +d.gross > 45 && string.indexOf(substring) > -1;
    //         }
    //         return string.indexOf(substring) > -1
    //       })
    //       ;
    //
    //       searchArray = _.filter(filteredSpectrumData, function(d,i) {
    //         return re.test(d["title"]);
    //       })
    //       ;
    //
    //       //
    //       var searchDivData = searchResults.selectAll("p")
    //         .data(searchArray, function(d){
    //           return d["imdb_id"];
    //         })
    //         ;
    //
    //       var searchEnter = searchDivData
    //         .enter()
    //         .append("p")
    //         .attr("class","tk-futura-pt search-result")
    //         .html(function(d){
    //           var final_str = d.title.replace(re, function(str) {return '<b><u>'+str+'</u></b>'});
    //           var percent = "<span class='search-result-percent'><span style='color:"+maleColor+";'>"+percentFormat(1-d.female_percent)+"</span>/<span style='color:"+femaleColor+";'>"+percentFormat(d.female_percent)+"</span></span>";
    //           return final_str + " " + percent;
    //         })
    //         .on("click",function(d){
    //           genreSelected = "all";
    //           updateSpectrumSearch(d);
    //           d3.selectAll(".filter-item-spectrum").style("background-color",null).style("box-shadow",null).style("border-color",null).style("font-weight",null);
    //           d3.select(".filter-item-spectrum").style("background-color","#F5F5F5").style("box-shadow","inset 0 3px 5px rgba(0,0,0,.125)").style("border-color","#adadad").style("font-weight","500");
    //           if(mobile){
    //             searchResults.style("display","none");
    //           }
    //         })
    //         ;
    //
    //       searchDivData.exit().remove();
    //
    //
    //     } else{
    //       searchResults.style("display","none");
    //     }
    //
    //   };
    // }
    //
    // searchSpectrum();

    var searchDiv = chartDivContainer.append("div")
      .attr("class","swarm-chart-search-div")

    searchDiv
      .append("input")
      .attr("class","swarm-chart-search")
      .attr("placeholder","Find a Newsroom")
      ;

    // searchDiv
    //   .append("div")
    //   .attr("class","swarm-chart-search-results");

    chartDivContainer.append("div")
      .attr("class","swarm-chart-source")
      .selectAll("p")
      .data(["Source: ASNE Survey, 2017","At least 50 staff"])
      .enter()
      .append("p")
      .attr("class","swarm-chart-source-text")
      .text(function(d){
        return d;
      })
      ;

    chartDivContainer.append("div")
      .attr("class","swarm-chart-logos")
      .style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
      .selectAll("div")
      .data(dataToMap.values)
      .enter()
      .append("div")
      .style("transform",function(d){
         return "translate(" + d.x+"px" + "," + d.y+"px" + ")"
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
        return d.radius*2+"px"
      })
      .style("height", function(d){
        return d.radius*2+"px"
      })
      .style("background-image",function(d){
        if(newsIDName.get(d.NewsID).Company=="the new york times"){
          return "url(assets/ny-times-logo.svg)"
        }
      })
      ;

  }
  function backgroundFunction(d){
    var state = null;
    var region = null;
    if(newsIdMap.has(d.NewsID)){
      state = newsIdMap.get(d.NewsID).State;
    }
    if(regionMap.has(state)){
      region = regionMap.get(state)[3];
    }
    if(region =="West"){
      return "green"
    }
    if(region =="South"){
      return "blue"
    }
    if(region =="Midwest"){
      return "purple"
    }
    if(region =="Northeast"){
      return "yellow"
    }
  }
  buildChart();

}

export default { init }
