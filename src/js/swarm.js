
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

function init(mapData,latLongData,newsIDLocation,newsIDInfo,top_3_data,censusData) {


  var censusMap = d3.map(censusData,function(d){ return d.city_state; });

  var yearSelected = 2014;
  var currentChart = "swarm";
	var cut = "gender"
  var group = "all"
  var countMin =  50;
  var mouseoverOffsetX = 20;
  var mouseoverOffsetY = -14;
  var stepperSequence = ["swarm","swarm","swarm-scatter","mini-multiple"];
  var companyImages = ["the new york times","the wall street journal","los angeles times","usa today"]

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

  function getPercentType(kind,dataSet){
    var data = dataSet.yearMap.get(yearSelected);

    if(kind == "gender"){
      return +(data.total_num-data.male_num)/data.total_num
    }
    if(kind == "supWhite"){
      return (+data.total_sup_num - +data.white_sup_num)/data.total_sup_num;
    }
    if(kind == "supGender"){
      return (+data.total_sup_num - +data.male_sup_num)/data.total_sup_num;
    }
    if(kind == "raceRaw"){
      return ((+data.total_num - +data.white_num)/data.total_num)
    }
    var racePoint = ((+data.total_num - +data.white_num)/data.total_num) - (1-dataSet.whiteCensus);
    return racePoint;
  }

	var latLongMap = d3.map(latLongData,function(d){ return d.NewsID});
	var newsIdMap = d3.map(newsIDLocation,function(d){ return d.NewsID});
  var newsIDName = d3.map(newsIDInfo,function(d){ return d.NewsID});
	var regionMap = d3.map(states,function(d){
		return d[1];
	});


  var newsIdSelected = 108;

  var margin = {top: 40, right: 20, bottom: 20, left: 20};
  var width = 1000 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;
  var container = d3.select(".swarm");

  var chartTopSection = container.append("div")
    .attr("class","chart-top-section")
    ;

  var chartTitle = container.append("p")
    .attr("class","chart-title")
    .html("Newsrooms, Broken-down <span>by Gender</span>")
    ;

  function buildStepper(){

    var stepperContainer = chartTopSection
      .append("div")
      .attr("class","stepper-container")


    var stepperTextArray = [
      "The Newsroom Employment Diversity Survey measures the percentage of minorities working in newsrooms nationwide",
      "Newsrooms are about 32 percetage points more white than the demographics they report on.",
      "When leadership goes up, so do newsroom"
    ];

    var stepperText = stepperContainer.append("p")
      .attr("class","stepper-container-text")
      .text(function(d){
        return stepperTextArray[0];
      })
      ;

    var stepperContainerToggle = stepperContainer.append("div")
      .attr("class","stepper-toggle-row")
      ;

    var stepperPlay = stepperContainerToggle.append("div")
      .attr("class","stepper-play-button")
      .on("click",function(d){
        buildChart("swarm-scatter");
      })
      ;

    var stepperPlayIcon = stepperPlay.append("div")
      .attr("class","stepper-arrow")
      ;

    var stepperPlayText = stepperPlay.append("p")
      .attr("class","stepper-play-text")
      .text("Start Tour")
      ;

    stepperContainerToggle
      .append("div")
      .attr("class","stepper-item-container")
      .selectAll("p")
      .data(stepperSequence)
      .enter()
      .append("p")
      .attr("class",function(d,i){
        if(i==0){
          return "stepper-item stepper-item-selected"
        }
        return "stepper-item"
      })
      .text(function(d,i){
        return i+1;
      })
      .on("click",function(d,i){

        var num = i;

        stepperText
          .transition()
          .duration(500)
          .style("opacity",0)
          .on("end",function(){
            stepperText.text(stepperTextArray[i])
              .transition()
              .duration(500)
              .style("opacity",1)
              ;
          });

        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("stepper-item-selected",function(d,i){
          if(i==num){
            return true;
          }
          return false;
        })
        currentChart = d;
        if(i==1){
          cut = "race";
        }
        else if(i==0){
          cut = "gender"
        }
        buildChart(d);
      })
      ;
  }
  buildStepper();

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

  var xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]);
  var yScale = d3.scaleLinear().domain([0,.1]).range([height,0]);

  var chartDivContainer = container
    .append("div")
    .attr("class","swarm-chart-container")
    .style("width",width+margin.left+margin.right+"px")

  var chartToolTip = chartDivContainer
    .append("div")
    .attr("class","swarm-chart-tool-tip")
    .style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
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

  var maxPercentArray = [];
  var diffArray = [];
  var raceDiffArray = []
  var averageArray = []

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
      if(d.value.yearMap.has(yearSelected) && d.value.values.length > 1){
        return d;
      }
      return null;
    });

    var totalExtent = d3.extent(newsNest,function(d){
      return +d.value.yearMap.get(yearSelected).total_num;
    })
    var radiusScale = d3.scaleLinear().domain(totalExtent).range([5,30]);

    for (var item in newsNest){

      var currentSup = getPercentType("supGender",newsNest[item].value)
      var currentYear = getPercent(newsNest[item].value.yearMap.get(yearSelected));
      var previousYear = getPercent(newsNest[item].value.values.filter(function(d){
        if(cut=="gender"){
          return +d.Year > 2000;
        }
        return d;
      })[0]);
      var diff = currentYear-previousYear;
      cut = "supGender";
      var raceDiff = getPercent(newsNest[item].value.yearMap.get(yearSelected))-getPercent(newsNest[item].value.values[0]);
      cut = "gender"
      diffArray.push(diff);
      raceDiffArray.push(raceDiff);

      var companyData = newsIDName.get(newsNest[item].key);
      var cityState = companyData.City+" "+companyData.State;

      newsNest[item].value.companyName = companyData.Company
      var whiteCensus = .9;
      if(censusMap.has(cityState)){
        whiteCensus = +censusMap.get(cityState).white_2015/100;
        // console.log(newsNest[item].value.companyName,newsNest[item].key,cityState);
      }
      else{
        console.log(newsNest[item]);
      }
      newsNest[item].value.whiteCensus = whiteCensus;
      newsNest[item].value.whiteDelta = getPercentType("race",newsNest[item].value)
      newsNest[item].value.diff = diff;
      newsNest[item].value.raceDiff = raceDiff;
      var totalCount = +newsNest[item].value.yearMap.get(yearSelected).total_num;
      newsNest[item].value.radius = radiusScale(totalCount);
      newsNest[item].value.currentYear = currentYear;
      newsNest[item].value.previousYear = previousYear;
      newsNest[item].value.currentSup = currentSup;

      // newsNest[item].top3Data = top3Map.get(newsNest[item].companyName);
    }
    ;

  var newsNestAverageT0 = d3.mean(newsNest,function(d){ return d.value.previousYear;});
  var newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.currentYear;});
  var newsNestSupAverageT1 = d3.mean(newsNest,function(d){ return d.value.currentSup;});

  var newsMap = d3.map(newsNest,function(d){return d.key});

  var diffExtent = d3.extent(diffArray,function(d){return d; });
  var colorScale = d3.scaleLinear().domain(diffExtent).range(["green","red"]);
  var genderColorScale = d3.scaleLinear().domain([.2,.5,.8]).range(["#2161fa","#dddddd","#ff3333"]);
  if(cut == "race"){
    genderColorScale.domain([0,.5,1]);
  }

  var cell;
  var cellCircle;
  var cellImages;
  var cellText;

  var chartAxis = chartDiv.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class","swarm-axis")
    ;

  var chartG = chartDiv
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var duration = 750;

  function buildChart(chartType){

    var highlightedPosition = [0,0,0];

    var highlightedStrokeColor = "#4b487d"

    function highlightedItem(selectedItem){
      if(chartType=="swarm" || chartType == "new"){
        selectedItem.style("stroke-width","2px").style("stroke",highlightedStrokeColor);
      }
    }

    function mouseOverEvents(data,element){
      if(chartType == "swarm" || chartType == "new"){

        element.style("stroke",function(){
          return "black";
        })
        ;

        chartToolTip
          .style("visibility","visible")
          .style("top",data.y + mouseoverOffsetY +"px")
          .style("left",data.x + data.value.radius + mouseoverOffsetX +"px")
          .text(function(d){
            if(cut == "race"){
              var raceValue = getPercentType("raceRaw",data.value);
              if(raceValue < .5){
                return data.value.companyName+" - "+Math.floor((1-raceValue)*100)+"% White. City - "+Math.floor(data.value.whiteCensus*100)+"% White";
              }
              return data.value.companyName+" - "+Math.floor((raceValue)*100)+"% Non-white. City - "+Math.floor((1-data.value.whiteCensus)*100)+"% Non-white"
            }
            return data.value.companyName+" - "+Math.floor(getPercentType("gender",data.value)*100)+"%";
          })
          ;
      }
      else if(chartType == "swarm-scatter"){
        chartToolTip
          .style("visibility","visible")
          .style("top", yScale(getPercentType("supGender",data.value)) + mouseoverOffsetY +"px")
          .style("left",xScale(getPercentType("gender",data.value)) + data.value.radius + mouseoverOffsetX +"px")
          .text(data.value.companyName+" - "+Math.floor(getPercentType("gender",data.value)*100)+"%");
      }
    }
    function mouseOutEvents(data,element){
      if(chartType == "swarm" || chartType == "new"){

        element.style("stroke",function(d){
          if(+data.key == newsIdSelected){
            return highlightedStrokeColor;
          }
          var value = getPercentType(cut,data.value);
          return d3.color(genderColorScale(value)).darker(1);
        });

        chartToolTip
          .style("visibility",null)
          .text("")
          ;
      }
      else if(chartType == "swarm-scatter"){
        element.style("stroke",function(d){
          if(+data.key == newsIdSelected){
            return highlightedStrokeColor;
          }
          return null;
        });

        chartToolTip
          .style("visibility",null)
          .text("")
          ;
      }
    }

    function changeTitle(){
      var title = "Newsrooms, Broken Down <span>by Gender</span>";
      if(cut=="race"){
        var title = "White/Non-White Breakdown of Newsrooms vs. City";
      }
      if(chartType == "swarm-scatter"){
        title = "Gender Break-down of Staff vs. Leaders";
      }
      else if(chartType == "arrow-scatter"){
        title = "Change in Gender Breakdown from 2002 - 2017"
      }
      chartTitle.html(title);
    }
    function setWidths(chartType){
      if(chartType == "swarm"){
        margin = {top: 40, right: 20, bottom: 20, left: 20};
        width = 1000 - margin.left - margin.right;
        height = 250 - margin.top - margin.bottom;
        if(cut == "race"){
          xScale.domain([-1,1]).range([0,width]).clamp(true);
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.whiteDelta;});
          genderColorScale.domain([-1,0,1]);
        }
        else if(cut == "gender"){
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.currentYear;});
          xScale.domain([.2,.8]).range([0,width]).clamp(true);
          genderColorScale.domain([.2,.5,.8]);
        }
      }
      if(chartType == "swarm-scatter"){
        margin = {top: 40, right: 20, bottom: 20, left: 20};
        width = 800 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;
        xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
        yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);
        newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.currentYear;});
      }
      if(chartType == "mini-multiple"){
        margin = {top: 40, right: 50, bottom: 20, left: 50};
        width = 1000 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;
      }

      chartDivContainer
        .transition()
        .duration(duration)
        .delay(duration)
        .style("width",width+margin.left+margin.right+"px")

      chartToolTip
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;

      chartDiv
        .transition()
        .duration(duration)
        .attr("height",height+margin.top+margin.bottom)
        .transition()
        .duration(duration)
        .attr("width",width+margin.left+margin.right)
        ;

      chartG
        .transition()
        .duration(500)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      chartAxis
        .transition()
        .duration(500)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    }
    // function cellTextShow(){
    //
    //   if (chartType == "mini-multiple"){
    //     cellText
    //       .style("opacity",function(d){
    //         if(d.value.top25==true){
    //           return 1;
    //         }
    //         return null;
    //       })
    //       ;
    //   }
    //   else if(chartType !="new"){
    //     cellText
    //       .style("opacity",null);
    //   }
    // }

    changeTitle();
    // cellTextShow();

    if(chartType!="new"){
      setWidths(chartType);
    }

    if(chartType == "swarm-scatter"){

      cellCircle
        .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        })
        .transition()
        .duration(duration)
        .delay(function(d,i){
          return i*10;
        })
        .attr("cx", function(d) {
          return xScale(getPercentType("gender",d.value));
          // return diffScale(d.value.diff);
        })
        .attr("cy", function(d) {
          return yScale(getPercentType("supGender",d.value));
        })
        .style("fill",null)
        .style("stroke",null)
        ;

      cellImages
        .transition()
        .duration(duration)
        .attr("transform", function(d){
          return "translate(" + xScale(getPercentType("gender",d.value)) + "," + yScale(getPercentType("supGender",d.value)) + ")"
        });
        ;

      chartAxis
        .select("g")
        .transition()
        .duration(250)
        .style("opacity",0)
        .on("end",function(d){
          d3.select(this).remove();
          buildAxis();
        })
        ;

      function buildAxis(){

        var chartAxisContainer = chartAxis.append("g")

        var chartAxisLines = chartAxisContainer.append("g")

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

        var chartAxisText = chartAxisContainer.append("g")

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
          .style("dominant-baseline",function(d,i){
            if(i==1){
              return "text-before-edge";
            }
            return "text-after-edge"
          })
          ;

        chartAxisText
          .append("g")
          .selectAll("rect")
          .data(["100% Male Staff","100% Female Staff"])
          .enter()
          .append("rect")
          .attr("x",function(d,i){
            if(i==0){
              return 0
            }
            return width
          })
          .attr("y",height/2)
          .attr("width",100)
          .attr("height",32)
          .attr("class","swarm-axis-tick-rect")
          .style("transform",function(d,i){
            if(i==1){
              return "translate(-100%,0)"
            }
            return null;
            // return "translate(100%,0)"
          })
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
              return "start";
            }
            return "end"
          })
          ;
      }

      function buildAverage(){

          chartDiv.select(".swarm-average").remove();

          var chartAverage = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             ;

         chartAverage.append("circle")
           .attr("class","swarm-circle swarm-circle-average")
           .attr("cx",xScale(newsNestAverageT1))
           .attr("cy",yScale(newsNestSupAverageT1))
           .attr("r",8)
           ;

         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x",xScale(newsNestAverageT1))
           .attr("y",yScale(newsNestSupAverageT1) - 26)
           .style("fill","black")
           .text("Overall")

          chartAverage.append("text")
            .attr("class","swarm-average-text")
            .attr("x",xScale(newsNestAverageT1))
            .attr("y",yScale(newsNestSupAverageT1) - 14)
            .text(function(){
              if(cut == "race"){
                return Math.round((1-newsNestSupAverageT1)*100)+"% White"
              }
              return Math.round((1-newsNestSupAverageT1)*100)+"% Male"
            })

      }
      buildAverage();

    }
    if(chartType == "swarm"){

      var forceCollide = d3.forceCollide()
          .radius(function(d) { return d.value.radius + 1; })
          .iterations(1);

      var simulation = d3.forceSimulation(newsNest)
          .force("x", d3.forceX(function(d) {
            return xScale(getPercentType(cut,d.value));
          })
          .strength(1))
          .force("y", d3.forceY(height / 2))
          .force("collide", forceCollide)
          .stop()
          ;

      chartAxis
        .select("g")
        .transition()
        .duration(500)
        .style("opacity",0)
        .on("end",function(d){
          d3.select(this).remove();
          buildAxis();
        })
        ;

      function buildAxis(){

          var chartAxisContainer = chartAxis.append("g")

          var tickData = [.2,.3,.5,.7,.8];
          var midPoint = .5
          if(cut == "race"){
            tickData = [-1,-.5,-.25,0,.25,1];
            midPoint = 0
          }

          var ticks = chartAxisContainer
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
              if(d==midPoint){
                return "#888";
              }
              return genderColorScale(d);
            })
            .attr("x1",function(d){
              console.log(xScale.range());
              return xScale(d);
            })
            .attr("x2",function(d){
              return xScale(d);
            })
            .attr("y1",function(d,i){
              if(d==midPoint){
                return height/2;
              }
              return 0
            })
            .attr("y2",function(d){
              if(d==midPoint){
                return 0;
              }
              return height*.05;
            })
            .attr("class","swarm-axis-tick")
            ;

          ticks
            .append("text")
            .attr("x",function(d){
              return xScale(d);
            })
            .attr("y",-9)
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
              if(d==midPoint){
                return "#888";
              }
              return genderColorScale(d);
            })
            .text(function(d,i){
              if(i==0){
                if(cut == "race"){
                  return "More White vs. City Census"
                }
                return Math.floor((1-d)*100)+"% Male Staff"
              }
              if(i==tickData.length-1){
                if(cut == "race"){
                  return "More People of Color vs. City Census"
                }
                return Math.floor(d*100)+"% Female Staff"
              }
              if(d==midPoint){
                if(cut == "race"){
                  return "Parity with City"
                }
                return "50/50  Split";
              }
              if(d<midPoint){
                if(cut == "race"){
                  return "+"+Math.floor(Math.abs(d)*100)+"%";
                }
                return Math.floor((1-d)*100)+"%";
              }
              if(cut == "race"){
                return "+"+Math.floor(Math.abs(d)*100)+"%";
              }
              return Math.floor(d*100)+"%";
            })
            ;

          chartAxisContainer.append("g")
            .append("line")
            .attr("x1",0)
            .attr("x2",width)
            .attr("y1",height/2)
            .attr("y2",height/2)
            .attr("class","swarm-axis-line")
      }

      for (var i = 0; i < 250; ++i) simulation.tick();

      cell
        .each(function(d){
          if(d.key == newsIdSelected){
            highlightedPosition = [d.x,d.y,d.value.radius];
          }
        })
        ;

      cellCircle
        .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        })
        .transition()
        .duration(duration)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill",function(d){
          var value = getPercentType(cut,d.value);
          return genderColorScale(value);
        })
        .style("stroke",function(d){
          if(d.key == newsIdSelected){
            return highlightedStrokeColor
          }
          var value = getPercentType(cut,d.value);
          return d3.color(genderColorScale(value)).darker(1);
        })
        ;

      cellImages
        .transition()
        .duration(duration)
        .attr("transform", function(d){
          return "translate(" + d.x + "," + d.y + ")"
        })
        ;

      function buildAverage(){

          chartDiv.select(".swarm-average").remove();

          var chartAverage = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             .style("opacity",0)
             ;

         var highlightedAnnotationOffset = height - highlightedPosition[1];

         var highlightedAnnotation = chartAverage.append("g")
            .attr("transform","translate("+highlightedPosition[0]+","+highlightedPosition[1]+")")

         highlightedAnnotation
           .append("line")
           .attr("class","swarm-axis-annotation-line")
           .attr("x1",0)
           .attr("x2",0)
           .attr("y1",highlightedPosition[2])
           .attr("y2",highlightedAnnotationOffset)
           .style("stroke",highlightedStrokeColor)
           ;

         highlightedAnnotation
          .append("text")
          .text(newsIdMap.get(newsIdSelected).Company)
          .attr("class","swarm-axis-annotation-text")
          .attr("y",highlightedAnnotationOffset+10)
          ;


         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x",xScale(newsNestAverageT1))
           .attr("y",height*.2-22)
           .text("Overall")

        chartAverage.append("text")
          .attr("class","swarm-average-text")
          .attr("x",xScale(newsNestAverageT1))
          .attr("y",height*.2-7)
          .text(function(){
            if(cut == "race"){
              return Math.round((Math.abs(newsNestAverageT1))*100)+"% More White"
            }
            return Math.round((1-newsNestAverageT1)*100)+"% Male"
          })

        chartAverage.append("line")
          .attr("class","swarm-average-line")
          .attr("x1",xScale(newsNestAverageT1))
          .attr("x2",xScale(newsNestAverageT1))
          .attr("y1",height*.2)
          .attr("y2",height*.8)
          ;

        chartAverage.transition().duration(duration).delay(duration).style("opacity",1)

      }
      buildAverage();

    }
    if(chartType == "new"){

      var forceCollide = d3.forceCollide()
          .radius(function(d) { return d.value.radius + 1; })
          .iterations(1);

      var simulation = d3.forceSimulation(newsNest)
          .force("x", d3.forceX(function(d) {
            return xScale(getPercentType("gender",d.value));
          })
          .strength(1))
          .force("y", d3.forceY(height / 2))
          .force("collide", forceCollide)
          .stop()
          ;

      function buildAxis(){

       var chartAxisContainer = chartAxis.append("g")

       var tickData = [.2,.3,.5,.7,.8];
       if(cut == "race"){
         tickData = [0,.3,.5,.7,1];
       }

       var ticks = chartAxisContainer
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
        .attr("y",-9)
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

       chartAxisContainer.append("g")
         .append("line")
         .attr("x1",0)
         .attr("x2",width)
         .attr("y1",height/2)
         .attr("y2",height/2)
         .attr("class","swarm-axis-line")

      }

      function buildAverage(){

          chartDiv.select(".swarm-average").remove();

          var chartAverage = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             ;

         var highlightedAnnotationOffset = height - highlightedPosition[1];

         var highlightedAnnotation = chartAverage.append("g")
            .attr("transform","translate("+highlightedPosition[0]+","+highlightedPosition[1]+")")

         highlightedAnnotation
           .append("line")
           .attr("class","swarm-axis-annotation-line")
           .attr("x1",0)
           .attr("x2",0)
           .attr("y1",highlightedPosition[2])
           .attr("y2",highlightedAnnotationOffset)
           .style("stroke",highlightedStrokeColor)
           ;

         highlightedAnnotation
          .append("text")
          .text(newsIdMap.get(newsIdSelected).Company)
          .attr("class","swarm-axis-annotation-text")
          .attr("y",highlightedAnnotationOffset+10)
          ;

         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x",xScale(newsNestAverageT1))
           .attr("y",height*.2-22)
           .text("Overall")

          chartAverage.append("text")
            .attr("class","swarm-average-text")
            .attr("x",xScale(newsNestAverageT1))
            .attr("y",height*.2-7)
            .text(function(){
              if(cut == "race"){
                return Math.round((1-newsNestAverageT1)*100)+"% White"
              }
              return Math.round((1-newsNestAverageT1)*100)+"% Male"
            })

          chartAverage.append("line")
            .attr("class","swarm-average-line")
            .attr("x1",xScale(newsNestAverageT1))
            .attr("x2",xScale(newsNestAverageT1))
            .attr("y1",height*.2)
            .attr("y2",height*.8)
            ;

      }

      for (var i = 0; i < 250; ++i) simulation.tick();

      cell = chartG
        .selectAll("g")
        .data(newsNest)
        .enter()
        .append("g")
        .sort(function(a,b){
          return b.value.radius - a.value.radius;
        })
        .each(function(d){
          if(d.key == newsIdSelected){
            highlightedPosition = [d.x,d.y,d.value.radius];
          }
        })
        ;

      cellCircle = cell
        .append("circle")
        .attr("class","swarm-circle")
        .attr("r", function(d){
          return d.value.radius
        })
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) { return d.y; })
        .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        })
        .style("fill",function(d){
          var value = getPercentType("gender",d.value);
          return genderColorScale(value);
          return colorScale(newsMap.get(d.NewsID).value.diff);
        })
        .style("stroke",function(d){
          var value = getPercentType("gender",d.value);
          return d3.color(genderColorScale(value)).darker(1);
          //return d3.color(colorScale(newsMap.get(d.NewsID).value.diff)).darker(2);
        })
        .each(function(d){
          if(d.key == newsIdSelected){
            highlightedItem(d3.select(this));
          }
        })
        ;

      cellImages = cell
        .append("g")
        .attr("transform",function(d,i){
          return "translate(" + d.x + "," + d.y + ")";
        })
        .attr("class","swarm-image-container")

      // cellImages
        // .each(function(d,i){
        //   d.value.top25 = false;
        //   if(i < 23){// > cellImages.size()-23){
        //      d.value.top25 = true;
        //   }
        // })
        ;

      cellImages
        // .filter(function(d){
        //   if(companyImages.indexOf(d.value.companyName)> -1){
        //     return d;
        //   }
        // })
        .append("image")
        .attr("class","swarm-image")
        .attr("xlink:href",function(d){
          if(d.value.companyName == "the new york times"){
            return "assets/ny-times-logo.svg"
          }
          if(d.value.companyName == "the wall street journal"){
            return "assets/wsj-logo.svg"
          }
          if(d.value.companyName == "los angeles times"){
            return "assets/la-times-logo.png"
          }
          if(d.value.companyName == "usa today"){
            return "assets/usa-today-logo.svg"
          }
          return null;
        })
        .attr("width",function(d){
          return d.value.radius*2*.7;
        })
        .attr("height",function(d){
          return d.value.radius*2*.7;
        })
        ;
      function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
      }

      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(capitalizeFirstLetter(word));
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [capitalizeFirstLetter(word)];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(capitalizeFirstLetter(word));
            }
          }
        });
      }

      // cellText = cellImages
      //   .filter(function(d){
      //     if(companyImages.indexOf(d.value.companyName) == -1){
      //       return d;
      //     }
      //   })
      //   .append("text")
      //   .attr("class","swarm-company-name")
      //   .text(function(d){
      //     return d.value.companyName;
      //   })
      //   .attr("dy",0)
      //   .style("opacity",0)
      //   ;

      // cellText
      //   .call(wrap, 70);
      //   ;

      buildAxis();
      buildAverage();

    }
    if(chartType == "mini-multiple"){

        var miniMargin = {top: 0, right: 20, bottom: 0, left: 20};
        var miniWidth = 70-miniMargin.left - miniMargin.right;
        var miniHeight = 161 - miniMargin.top - miniMargin.bottom;
        var multipleY = d3.scaleLinear().domain([.2,.5]).range([miniHeight,0]);
        var miniTextHeight = 46;
        var miniMulitpleCount = Math.floor(width/(miniWidth+miniMargin.left+miniMargin.right))+1;
        //
        // cellImages.selectAll("image")
        //   .attr("width",miniWidth+miniMargin.left+miniMargin.right)
        //   .attr("height",miniTextHeight)
        //   ;
        //
        // chartAxis
        //   .select("g")
        //   .transition()
        //   .duration(250)
        //   .style("opacity",0)
        //   .on("end",function(d){
        //     d3.select(this).remove();
        //   })
        //   ;
        //
        // chartDiv.select(".swarm-average").remove();
        //
        // cellImages
        //   .filter(function(d){
        //     return d.value.top25 == true;
        //   })
        //   .transition()
        //   .duration(duration)
        //   .attr("transform", function(d,i){
        //     var left = +i%miniMulitpleCount*(miniWidth+miniMargin.left+miniMargin.right);
        //     var top = +Math.floor(i/miniMulitpleCount)*(miniHeight+miniMargin.top+miniMargin.bottom);
        //     return "translate(" + left + "," + top + ")"
        //   })
        //   ;

    }
  }

  buildChart("new");

  var footerContainer = container.append("div")
    .attr("class","footer-container")
    ;

  footerContainer.append("div")
    .attr("class","news-lab-logo")
    ;

  footerContainer.append("div")
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


  function buildToggles(){
    var toggles = footerContainer.append("div")
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
        buildChart(currentChart);
      })
      ;

    var raceGenderToggleData = ["gender","race"];//,"supWhite","supGender"]

    toggles
      .append("div")
      .attr("class","histogram-chart-toggle-type histogram-chart-toggle-first")
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
        buildChart(currentChart);
      })
      ;

    var searchDiv = toggles.append("div")
      .attr("class","swarm-chart-search-div")

    searchDiv
      .append("input")
      .attr("class","swarm-chart-search")
      .attr("placeholder","Find a Newsroom")
      .on("focus",function(d){
        searchResultsContainer.style("display","block")
      })
      .on("focusout",function(d){
        searchResultsContainer.style("display",null)
      })
      ;

    var searchResultsContainer = searchDiv
      .append("div")
      .attr("class","swarm-chart-search-results");

    var searchAlphaSort = searchResultsContainer
      .append("div")
      .attr("class","swarm-chart-search-results-alpha-container");

    searchAlphaSort.append("p")
      .text("filter")
      .attr("class","swarm-chart-search-results-alpha-label");

    searchAlphaSort
      .append("div")
      .attr("class","swarm-chart-search-results-alpha-item-container")
      .selectAll("p")
      .data(["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"])
      .enter()
      .append("p")
      .attr("class","swarm-chart-search-results-alpha-item")
      .text(function(d){
        return d;
      })
      ;

    var searchResults = searchResultsContainer.append("div")
      .attr("class","swarm-chart-search-results-result-container")
      .selectAll("div")
      .data(newsIDInfo)
      .enter()
      .append("div")
      .attr("class","swarm-chart-search-results-result")
      .append("p")
      .attr("class","swarm-chart-search-results-result-text")
      .text(function(d){
        return d.Company;
      })
      ;


    var leaderToggleData = ["all","leader"];
    //
    // toggles
    //   .append("div")
    //   .attr("class","histogram-chart-toggle-type")
    //   .selectAll("p")
    //   .data(leaderToggleData)
    //   .enter()
    //   .append("p")
    //   .attr("class",function(d,i){
    //     if(i==0){
    //       return "toggle-selected front-curve histogram-chart-toggle-item";
    //     }
    //     if(i==leaderToggleData.length-1){
    //       return "back-curve histogram-chart-toggle-item";
    //     }
    //     return "histogram-chart-toggle-item";
    //   })
    //   .text(function(d){
    //     if(d=="all"){
    //       return "All Staff"
    //     }
    //     return "Leadership";
    //   })
    //   .on("click",function(d){
    //     var dataSelected = d;
    //     d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
    //       if(d==dataSelected){
    //         return true;
    //       }
    //       return false;
    //     })
    //     group = d;
    //     buildChart(currentChart);
    //   })
    //   ;
  }
  buildToggles()

}

export default { init }
