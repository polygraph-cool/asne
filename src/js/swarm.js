

import geolib from 'geolib'
import locate from './utils/locate'
import urlParameter from './utils/url-parameter'

var mobile = false;
var fullWidth = false;
var tablet = false;
if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  mobile = true;
}

var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var cutAmount = 4;
if(viewportWidth<800){
 cutAmount = 3;
}
if(viewportWidth<700){
 cutAmount = 2;
}
if(viewportWidth<500){
 cutAmount = 1;
}

const urlParam = urlParameter.get('view');
const urlParamCut = urlParameter.get('filter');
const urlParamEmbed = urlParameter.get('embed');

if(urlParamEmbed){
  d3.select("#content").classed("embedded",true);
}

function wrapTwo(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.3, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.05, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em").style("font-weight", 500);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").style("font-size","12px").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
function wrapThree(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.3, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

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

function init(rawMapData,latLongData,newsIDInfo,stateTopo,censusData,censusOverride,new_2018) {

  console.log(new_2018);


  var mergedData = [];
  var newDataIDs = new_2018.map(function(d){return +d.NewsID});
  var oldIDs = rawMapData.filter(function(d){
    return +d.Year == 2017
  });

  // for (var newsRoom in oldIDs){
  //   if (newDataIDs.indexOf(+oldIDs[newsRoom]["NewsID"]) == -1){
  //     oldIDs[newsRoom]["Year"] = 2019;
  //     mergedData.push(oldIDs[newsRoom])
  //   }
  // }

  mergedData = new_2018
  //mergedData = mergedData.concat(new_2018);
  console.log(mergedData);
  var mapData = rawMapData.concat(mergedData)



  var newToggleForRaceAndGender;
  var alphaSort = ""
  var searchMap;
  var footerContainer;
  var stepperContainerToggle;
  var stepperBack;
  var chartTableItem;
  var miniMultipleWrapper;
  var toggleType;
  var miniTextHeight = 70;
  var miniMargin = {top: 0, right: 20, bottom: 0, left: 20};
  var miniWidth = 70-miniMargin.left - miniMargin.right;
  var miniHeight = 90 - miniMargin.top - miniMargin.bottom;
  var multipleY = d3.scaleLinear().domain([.2,.5]).range([miniHeight,0]);
  var embedLinkText;
  var embedLinkInput;
  var censusOverrideMap = d3.map(censusOverride,function(d){
    return +d.news_id;
  });
  var extentOverride;


  var mapBig = false;
  var censusMap = d3.map(censusData,function(d){ return d.city_state; });
  var searchInput;
  var newsIDSearch = "";
  var searchResults;
  var searchResultText;
  var newsIDSearchColor = "#7354ab"
  var searchAlphaSortLetters;
  var searchResultsContainer;
  var yearSelected = 2019;
  var yearOld = 2004;
  var currentChart = "swarm";
  var previousChart = "swarm";
  var previousCut = "gender";
  var cut = "gender";

  if(urlParamCut != ""){
    previousCut = urlParamCut;
    cut = urlParamCut;
  }

  var group = "all";
  var newsIDSearchList =  [];
  var countMin =  25;
  var mouseoverOffsetX = 20;
  var mouseoverOffsetY = -14;
  var stepperSequence = ["swarm","swarm-scatter","arrow-scatter","arrow-scatter-full","table"];
  var companyImages = ["the new york times","the wall street journal","los angeles times","usa today"]
  var tableData = [];
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

    if(kind == "gender-old"){
      kind = "gender"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "race-old"){
      kind = "race"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "white-old"){
      kind = "white"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "black-old"){
      kind = "black"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "hisp-old"){
      kind = "hisp"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "asian-old"){
      kind = "asian"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
    }
    if(kind == "sup-white-old"){
      kind = "supWhiteRaw"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "sup-gender-old"){
      kind = "supGender"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "sup-black-old"){
      kind = "supBlack"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "sup-hisp-old"){
      kind = "supHisp"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "sup-asian-old"){
      kind = "supAsian"
      data = dataSet.values.filter(function(d){
        return +d.Year == yearOld;
      });
      if(data.length>0){
        data = data[0];
      }
      else{
        return "n/a"
      }
      // data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "gender"){
      return +(data.total_num-data.male_num)/data.total_num
    }
    if(kind == "supWhite"){
      return (+data.total_sup_num - +data.white_sup_num)/data.total_sup_num;
    }
    if(kind == "supBlack"){
      return (+data.black_sup_num)/data.total_sup_num;
    }
    if(kind == "supHisp"){
      return (+data.hisp_sup_num)/data.total_sup_num;
    }
    if(kind == "supAsian"){
      return (+data.asian_sup_num)/data.total_sup_num;
    }
    if(kind == "supWhiteAdjusted"){
      var racePoint = ((+data.total_sup_num - +data.white_sup_num)/data.total_sup_num) - (1-dataSet.whiteCensus);
      return racePoint;
    }
    if(kind == "supGender"){
      return (+data.total_sup_num - +data.male_sup_num)/data.total_sup_num;
    }
    if(kind == "raceRaw"){
      return ((+data.total_num - +data.white_num)/data.total_num)
    }
    if(kind == "white"){
      return +(data.white_num)/data.total_num;
    }
    if(kind == "black"){
      return +(data.black_num)/data.total_num;
    }
    if(kind == "hisp"){
      return +(data.hisp_num)/data.total_num;
    }
    if(kind == "asian"){
      return +(data.asian_num)/data.total_num;
    }
    if(kind == "supWhiteRaw"){
      return (+data.white_sup_num)/data.total_sup_num;
    }
    if(kind == "genderStaff"){

      return +(data.total_num-data.male_num-(+data.total_sup_num - +data.male_sup_num))/(data.total_num-data.total_sup_num)
    }
    if(kind == "raceStaff"){
      return (+data.total_num - +data.white_num - (+data.total_sup_num - +data.white_sup_num))/(data.total_num - data.total_sup_num)
    }
    if(kind == "whiteStaff"){
      return (+data.white_num - +data.white_sup_num)/(data.total_num - data.total_sup_num)
    }
    if(kind == "blackStaff"){
      return (+data.black_num - +data.black_sup_num)/(data.total_num - data.total_sup_num)
    }
    if(kind == "hispStaff"){
      return (+data.hisp_num - +data.hisp_sup_num)/(data.total_num - data.total_sup_num)
    }
    if(kind == "asianStaff"){
      return (+data.asian_num - +data.asian_sup_num)/(data.total_num - data.total_sup_num)
    }
    var racePoint = ((+data.total_num - +data.white_num)/data.total_num) - (1-dataSet.whiteCensus);
    return racePoint;
  }

  newsIDInfo.forEach(function(d){
    var first = d.Company.charAt(0);
    var second = "";
    if(d.Company.split(" ").length > 1){
      second = d.Company.split(" ")[1].charAt(0)
    }
    d.chars = [first,second];

    var override = {};
    var hasOverride = false;
    if(censusOverrideMap.has(+d.NewsID)){
      override = censusOverrideMap.get(+d.NewsID);
      hasOverride = true;
    }
    d.override = override;
    d.hasOverride = hasOverride;
  })

	var latLongMap = d3.map(latLongData.filter(function(d){
    return d.lng != "NULL";
  }),function(d){ return d.NewsID});
  var newsIDName = d3.map(newsIDInfo,function(d){ return d.NewsID});
	var regionMap = d3.map(states,function(d){
		return d[1];
	});

  var newsIdSelected = 108;

  var margin = {top: 40, right: 20, bottom: 70, left: 20};
  var width = 1000 - margin.left - margin.right;
  var height = 300 - margin.top - margin.bottom;
  var container = d3.select(".swarm");
  if(viewportWidth < 1000){
    width = viewportWidth - margin.left - margin.right;
  }
  if(viewportWidth < 400 || mobile){
    height = 400 - margin.top - margin.bottom;
  }

  var chartTopSection = container.append("div")
    .attr("class","chart-top-section")
    ;

  function buildStepper(){

    var stepperContainer = chartTopSection
      .append("div")
      .attr("class","stepper-container")

    var stepperTextArray = [
      "The Newspaper Diversity Survey measures the percentage of women and minorities working in US newsrooms. The results<span class='note-new-data'>*</span> from "+yearSelected+"&rsquo;s survey are in.",
      "Newsrooms are about 32 percetage points more white than the audience they report on.",
      "When measuring leadership, newsrooms with more diversity tended to also have diverse staffs.",
      "change over time",
      "change over time 2"
    ];

    var stepperText = stepperContainer
      .append("div")
      .attr("class","stepper-container-text-container")
      .append("p")
      .attr("class","stepper-container-text")
      .html(function(d){
        return stepperTextArray[0];
      })
      ;

    stepperContainerToggle = stepperContainer.append("div")
      .attr("class","stepper-toggle-row")
      ;

    function changeStepper(direction){

      stepperPlayIcon
        .style("display","none");

      stepperPlayText
        .transition()
        .duration(750)
        .text("Loading...")
        .transition()
        .duration(250)
        .style("opacity",0)
        .on("end",function(){
          stepperPlayIcon
            .style("display","block");
        })
        .transition()
        .duration(250)
        .style("opacity",1)
        .text("Resume")

      var previous;

      stepperContainerToggleContainerSteps
        .each(function(d,i){
          if(d3.select(this).classed("stepper-item-selected")==true){
            previous = i;
          }
        })
        ;

      if(previous==4 && direction == "forward"){
        previous = -1;
      }

      if(direction == "forward"){
        currentChart = stepperSequence[previous+1]
        stepperContainerToggleContainerSteps.classed("stepper-item-selected",function(d,i){
          if(d==currentChart && i == previous+1){
            return true;
          }
          return false;
        })
        ;

      }
      else{
        currentChart = stepperSequence[previous-1]
        stepperContainerToggleContainerSteps.classed("stepper-item-selected",function(d,i){
          if(d==currentChart && i == previous-1){
            return true;
          }
          return false;
        })
        ;

      }

      buildChart(currentChart);

    }

    stepperBack = stepperContainerToggle.append("div")
      .attr("class","stepper-back")
      .on("click",function(d){
        changeStepper("backward");
      })
      ;
    var stepperPlay = stepperContainerToggle.append("div")
      .attr("class","stepper-play-button")
      .on("click",function(d){
        changeStepper("forward");
      })
      ;

    stepperBack
      .append("svg")
      .attr("viewBox","0 0 24 14")
      .attr("width","100%")
      .attr("height","100%")
      .append("path")
      .attr("d","M0 7.002a.999.999 0 0 0 .286.693l.006.012 6 6a1 1 0 0 0 1.414-1.414L3.414 7.998H23a1 1 0 0 0 0-2H3.414l4.292-4.291A1 1 0 0 0 6.292.293l-6 6-.006.01a.978.978 0 0 0-.208.313.974.974 0 0 0-.078.382v.004z")
      ;

    var stepperPlayIcon = stepperPlay.append("div")
      .attr("class","stepper-arrow")
      ;

    var stepperPlayText = stepperPlay.append("p")
      .attr("class","stepper-play-text")
      .text("Start")
      ;

    var stepperContainerToggleContainer = stepperContainerToggle
      .append("div")
      .attr("class","stepper-item-container")

    var toggleText = ["View "+yearSelected+" <span>Gender</span> and <span>Race</span> Data","How Leadership Compares","How Top Newsrooms Changed","Overall Change for All Newsrooms","Individual Newsroom Demographics"];

    var stepNumToText = [yearSelected+" results","Leadership",yearOld+" vs. "+yearSelected+": Top Newsrooms","Overall Change","My Newsroom"];

    if(viewportWidth < 620){
      stepNumToText = [yearSelected+" Results","Newsroom Leaders","Top Newsrooms","Change","My Newsroom"];
    }

    var stepperContainerToggleContainerSteps = stepperContainerToggleContainer
      .selectAll("div")
      .data(stepperSequence)
      .enter()
      .append("div")
      .attr("class",function(d,i){
        if(urlParam != ""){
          if(i==urlParam){
            return "stepper-item stepper-item-selected"
          }
        }
        else{
          if(i==0){
            return "stepper-item stepper-item-selected"
          }
        }

        return "stepper-item"
      })
      .html(function(d,i){
        if(i==4){
          return "<span class='stepper-text'>"+stepNumToText[i]+"</span>";
        }
        return "<span class='stepper-text'>"+stepNumToText[i]+"</span>" + "<span class='stepper-bar'> | </span>";
        // return i+1;
      })
      .on("mouseover",function(d,i){
        var item = i;
        var dataSelected = d;
        stepperContainerToggleContainerHover
          .style("visibility",function(d,i){
            if (d == dataSelected && !mobile){
              return "visible"
            }
            return null;
          })
          .html(function(){
            return toggleText[item];
          })
          ;
      })
      .on("mouseout",function(){
        stepperContainerToggleContainerHover.style("visibility",null);
      })
      .on("click",function(d,i){

        embedLinkText.text("Embed this chart");
        embedLinkInput.style("display",null);

        urlParameter.set('view', i);

        var num = i;

        // stepperText
        //   .transition()
        //   .duration(500)
        //   .style("opacity",0)
        //   .on("end",function(){
        //     stepperText.text(stepperTextArray[i])
        //       .transition()
        //       .duration(500)
        //       .style("opacity",1)
        //       ;
        //   });

        var dataSelected = d;
        d3.select(this.parentNode).selectAll(".stepper-item").classed("stepper-item-selected",function(d,i){
          if(i==num){
            return true;
          }
          return false;
        })
        currentChart = d;
        buildChart(d);
      })
      ;

    var stepperContainerToggleContainerHover = stepperContainerToggleContainerSteps
      .append("div")
      .attr("class","stepper-item-hover")
      .html(function(d){
        return "";
      })
      ;


  }
  buildStepper();

  function searchSpectrum(){

    // var searchDiv = toggles.append("div")
    //   .attr("class","swarm-chart-search-div")
    //
    // searchDiv
    //   .append("input")
    //   .attr("class","swarm-chart-search")
    //   .attr("placeholder","Find a Newsroom")
    //   .on("focus",function(d){
    //     searchResultsContainer.style("display","block")
    //   })
    //   .on("focusout",function(d){
    //     searchResultsContainer.style("display",null)
    //   })
    //   ;
    //
    // var searchResultsContainer = searchDiv
    //   .append("div")
    //   .attr("class","swarm-chart-search-results");
    //
    // var searchAlphaSort = searchResultsContainer
    //   .append("div")
    //   .attr("class","swarm-chart-search-results-alpha-container");
    //
    // searchAlphaSort.append("p")
    //   .text("filter")
    //   .attr("class","swarm-chart-search-results-alpha-label");
    //
    // searchAlphaSort
    //   .append("div")
    //   .attr("class","swarm-chart-search-results-alpha-item-container")
    //   .selectAll("p")
    //   .data(["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"])
    //   .enter()
    //   .append("p")
    //   .attr("class","swarm-chart-search-results-alpha-item")
    //   .text(function(d){
    //     return d;
    //   })
    //   ;
    //
    // var searchResults = searchResultsContainer.append("div")
    //   .attr("class","swarm-chart-search-results-result-container")
    //   .selectAll("div")
    //   .data(newsIDInfo)
    //   .enter()
    //   .append("div")
    //   .attr("class","swarm-chart-search-results-result")
    //   .append("p")
    //   .attr("class","swarm-chart-search-results-result-text")
    //   .text(function(d){
    //     return d.Company;
    //   })
    //   ;
    //


    var searchArray = [];
    var searchResultMouseOver = false;


    searchInput
      .on("keyup", keyupedFilmColumn)
      ;
    //
    function keyupedFilmColumn() {
      searchNewsroom(this.value.trim());
    }

    function searchNewsroom(value) {
      if (value.length > 2) {

        searchAlphaSortLetters.style("color",null).style("text-decoration",null);
        alphaSort = "";
        // searchResults.style("display","block");

        function escapeString(s) {
          return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

        var re = new RegExp("\\b" + escapeString(value), "i");
        // var filteredSpectrumData = spectrumData.filter(function(d,i){
        //   var string = d.genreList;
        //   if(genreSelected == "all" && stage == 3){
        //     return +d.gross > 45;
        //   }
        //   else if(genreSelected =="all" && stage == 2){
        //     return d;
        //   }
        //   else if(stage == 3){
        //     var substring = genreSelected;
        //     return +d.gross > 45 && string.indexOf(substring) > -1;
        //   }
        //   return string.indexOf(substring) > -1
        // })
        // ;
        //

        searchResults.style("display",function(d,i){
          if(re.test(d.value.companyName)){
            return "block"
          }
          return "none";
        });

        // searchArray = _.filter(filteredSpectrumData, function(d,i) {
        //   return re.test(d["title"]);
        // })
        // ;
        //
        // //
        // var searchDivData = searchResults.selectAll("p")
        //   .data(searchArray, function(d){
        //     return d["imdb_id"];
        //   })
        //   ;
        //
        // var searchEnter = searchDivData
        //   .enter()
        //   .append("p")
        //   .attr("class","tk-futura-pt search-result")
        //   .html(function(d){
        //     var final_str = d.title.replace(re, function(str) {return '<b><u>'+str+'</u></b>'});
        //     var percent = "<span class='search-result-percent'><span style='color:"+maleColor+";'>"+percentFormat(1-d.female_percent)+"</span>/<span style='color:"+femaleColor+";'>"+percentFormat(d.female_percent)+"</span></span>";
        //     return final_str + " " + percent;
        //   })
        //   .on("click",function(d){
        //     genreSelected = "all";
        //     updateSpectrumSearch(d);
        //     d3.selectAll(".filter-item-spectrum").style("background-color",null).style("box-shadow",null).style("border-color",null).style("font-weight",null);
        //     d3.select(".filter-item-spectrum").style("background-color","#F5F5F5").style("box-shadow","inset 0 3px 5px rgba(0,0,0,.125)").style("border-color","#adadad").style("font-weight","500");
        //     if(mobile){
        //       searchResults.style("display","none");
        //     }
        //   })
        //   ;
        //
        // searchDivData.exit().remove();

      } else{
        searchResults.style("display",null);
      }

    };
  }

  var xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
  var yScale = d3.scaleLinear().domain([0,.1]).range([height,0]);

  var chartDivContainer = container
    .append("div")
    .attr("class","swarm-chart-container")
    .style("width",width+margin.left+margin.right+"px")

  var chartDivContainerTable = chartDivContainer.append("div")
    .attr("class","swarm-chart-container-table");

  var chartTitle = chartDivContainer.append("p")
    .attr("class","chart-title")
    .html("Newsrooms, Broken-down <span>by Gender</span>")
    .style("left",margin.left+"px")
    ;

  // var miniMultiple = chartDivContainer.append("div")
  //   .attr("class","slope-mini-multiple-div")
  //   ;

  var chartToolTip = chartDivContainer
    .append("div")
    .attr("class","swarm-chart-tool-tip")
    .style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .on("click",function(){
      chartToolTip.style("visibility",null);
    })
    ;

  var chartDiv = chartDivContainer
    .append("svg")
    .attr("class","swarm-chart-wrapper")
    .attr("width",width+margin.left+margin.right)
    .attr("height",height+margin.top+margin.bottom)
    ;

  var defs = chartDiv.append("svg:defs")

  defs
    .append("marker")    // This section adds in the arrows
    .attr("id", "arrow-head")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", 5)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill","#d8d8d8")
    ;

  var linearGradientRight = defs
    .append("linearGradient")
    .attr("id","gradient-blue")
    .attr("x1",0)
    .attr("x2",1)
    .attr("y1",0)
    .attr("y2",0)

  var linearGradientAverage = defs
    .append("linearGradient")
    .attr("id","gradient-average")
    .attr("x1",0)
    .attr("x2",1)
    .attr("y1",0)
    .attr("y2",0)

  linearGradientAverage
    .append("stop")
    .attr("stop-color","black")
    .attr("stop-opacity",.15)

  linearGradientAverage
    .append("stop")
    .attr("offset","100%")
    .attr("stop-color","black")
    .attr("stop-opacity",1)

  linearGradientRight
    .append("stop")
    .attr("stop-color","blue")
    .attr("stop-opacity",.15)

  linearGradientRight
    .append("stop")
    .attr("offset","100%")
    .attr("stop-color","blue")
    .attr("stop-opacity",1)

  var linearGradientLeft = defs
    .append("linearGradient")
    .attr("id","gradient-red")
    .attr("x1",1)
    .attr("x2",0)
    .attr("y1",0)
    .attr("y2",0)

  linearGradientLeft
    .append("stop")
    .attr("stop-color","red")
    .attr("stop-opacity",.15)

  linearGradientLeft
    .append("stop")
    .attr("offset","100%")
    .attr("stop-color","red")
    .attr("stop-opacity",1)

  var linearGradientStartRight = defs
    .append("linearGradient")
    .attr("id","gradient-right")
    .attr("x1",0)
    .attr("x2",1)
    .attr("y1",0)
    .attr("y2",0)

  linearGradientStartRight
    .append("stop")
    .attr("stop-color","#a7a7a7")
    .attr("stop-opacity",.15)

  linearGradientStartRight
    .append("stop")
    .attr("offset","100%")
    .attr("stop-color","#a7a7a7")
    .attr("stop-opacity",1)

  var linearGradientStartLeft = defs
    .append("linearGradient")
    .attr("id","gradient-left")
    .attr("x1",1)
    .attr("x2",0)
    .attr("y1",0)
    .attr("y2",0)

  linearGradientStartLeft
    .append("stop")
    .attr("stop-color","#868686")
    .attr("stop-opacity",.15)

  linearGradientStartLeft
    .append("stop")
    .attr("offset","100%")
    .attr("stop-color","#868686")
    .attr("stop-opacity",1)

  defs
    .append("marker")    // This section adds in the arrows
    .attr("id", "arrow-head-black")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", 7)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill","#000000")
    ;

  var filteredMapData = mapData.filter(function(d){
    if(cut == "supWhite" || cut == "supGender"){
      return d.total_num > countMin && d.total_sup_num > 0;
    }
    return d//d.total_num > countMin;
  })
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


    var hasOverride = 0;

    var cutOutData = [];
    var searchDataSet = []

    newsNest = newsNest.filter(function(d){
      if(d.value.yearMap.has(yearSelected)){
        return d;
      }
      return null;
    });

    var totalExtent = d3.extent(newsNest,function(d){
      return +d.value.yearMap.get(yearSelected).total_num;
    })

    totalExtent[1] = 600;

    var radiusScale = d3.scaleLinear().domain([countMin,totalExtent[1]]).range([4,24]).clamp(true);

    for (var item in newsNest){

      var currentSup = getPercentType("supGender",newsNest[item].value)
      var currentYear = getPercentType("gender",newsNest[item].value);
      var previousYear = getPercentType("gender-old",newsNest[item].value)

      var diff = 0
      if(previousYear == "n/a"){
        diff = null;
      }
      else{
        diff = currentYear-previousYear;
      }

      var whiteCensus = 9999;
      var blackCensus = 9999;
      var hispanicCensus = 9999;
      var asianCensus = 9999;
      var femaleCensus = 50;

      var companyData = newsIDName.get(newsNest[item].key);
      var cityState = companyData.City+" "+companyData.State;
      newsNest[item].value.companyData = companyData;

      if(companyData.hasOverride){
        hasOverride = hasOverride + 1;
        whiteCensus = +companyData.override.white/100;
        blackCensus = +companyData.override.black/100;
        hispanicCensus = +companyData.override.hispanic/100;
        femaleCensus = companyData.override.female;
        asianCensus = companyData.override.asian/100;
        if(femaleCensus != "n/a"){
          femaleCensus = +femaleCensus/100;
        }
      }
      else if(censusMap.has(cityState)){

        whiteCensus = +censusMap.get(cityState).white_2015/100;
        blackCensus = +censusMap.get(cityState).black_2015/100;
        hispanicCensus = +censusMap.get(cityState).hispanic_2015/100;
        femaleCensus = censusMap.get(cityState).female_2015/100;
        asianCensus = censusMap.get(cityState).asian_2015/100;

      }
      newsNest[item].value.whiteCensus = whiteCensus;
      newsNest[item].value.blackCensus = blackCensus;
      newsNest[item].value.hispanicCensus = hispanicCensus;
      newsNest[item].value.femaleCensus = femaleCensus;
      newsNest[item].value.asianCensus = asianCensus;

      var raceDiff = 0;

      if(getPercentType("race-old",newsNest[item].value) == "n/a"){
        raceDiff = null;
      }
      else{
        raceDiff = getPercentType("race",newsNest[item].value)-getPercentType("race-old",newsNest[item].value);
      }

      diffArray.push(diff);
      raceDiffArray.push(raceDiff);

      newsNest[item].value.companyName = companyData.Company

      var first = companyData.Company.charAt(0);
      var second = "";
      if(companyData.Company.split(" ").length > 1){
        second = companyData.Company.split(" ")[1].charAt(0)
      }
      newsNest[item].value.chars = [first,second];

      newsNest[item].value.whiteDelta = getPercentType("race",newsNest[item].value)
      newsNest[item].value.diff = diff;
      newsNest[item].value.raceDiff = raceDiff;
      var totalCount = +newsNest[item].value.yearMap.get(yearSelected).total_num;
      newsNest[item].value.radius = radiusScale(totalCount);
      newsNest[item].value.currentYear = currentYear;
      newsNest[item].value.previousYear = previousYear;
      newsNest[item].value.currentSup = currentSup;

      if(latLongMap.has(newsNest[item].key)){
        var locationData = latLongMap.get(newsNest[item].key);
        newsNest[item].value.location = {latitude:+locationData.lat,longitude:+locationData.lng};
        newsNest[item].value.hasLocation = true
      }
      else{
        newsNest[item].value.hasLocation = false
      }

      // newsNest[item].top3Data = top3Map.get(newsNest[item].companyName);
    }
    ;

  newsNest = newsNest.filter(function(d){
    searchDataSet.push(d);
    var count = d.value.yearMap.get(yearSelected).total_num;
    if(count > countMin){
      return d;
    }
    else{
      cutOutData.push(d);
    }
    return null;
  });

  newsNest = newsNest.sort(function(a,b){
    return b.value.radius - a.value.radius;
  });

  var countMini = -1;

  for (var item in newsNest){
    newsNest[item].value.miniChart = -1
    if(newsNest[item].value.yearMap.has(yearOld) && countMini < 21){
      countMini = countMini + 1;
      newsNest[item].value.miniChart = countMini;
    }
  };

  var newsNestAverageT0 = d3.mean(newsNest,function(d){
    if(d.value.previousYear == "n/a"){
      return null;
    }
    return d.value.previousYear;
  });
  var newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.currentYear;});
  var newsNestSupAverageT1 = d3.mean(newsNest,function(d){ return getPercentType("supGender",d.value)});

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
  var cellCircleTwo;
  var cellLine;
  var cellDash;

  var chartAxis = chartDiv.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class","swarm-axis")
    ;

  var chartG = chartDiv
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var duration = 750;

  function buildChart(chartType){
    var rebuildAxis = false;

    if(chartType != "new" && chartType != "swarm"){
      stepperBack.style("visibility","visible").style("pointer-events","all");
      if(previousChart!=chartType || chartType == "table"){
        previousChart = chartType;
        rebuildAxis = true;
      }
      else if(previousCut!=cut){
        previousCut = cut;
        rebuildAxis = true;
      }
      else{
        rebuildAxis = false;
      }
    } else{
      stepperBack.style("visibility",null).style("pointer-events",null);
    }

    var highlightedPosition = [0,0,0];

    var highlightedStrokeColor = "#555555"
    var highlightedCircleStrokeDarkness = 2;

    function highlightedItem(selectedItem){
      if(chartType=="swarm" || chartType == "new"){
        selectedItem.style("stroke-width","2px").style("stroke",d3.color(selectedItem.style("stroke")).darker(highlightedCircleStrokeDarkness));
      }
    }

    function mouseOverEvents(data,element){
      chartToolTip.selectAll("div").remove();

      var chartToolTipContainer = chartToolTip.append("div");

      var chartToolTipCompany = chartToolTipContainer.append("p")
        .attr("class","swarm-chart-tool-tip-company")
        .style("text-transform",function(d){
          if(data.value.companyName == "usa today"){
            return "none";
          }
          return null;
        })
        .html(function(d){
          var oldData = newDataIDs.indexOf(+data.key);
          var textValue = "";
          if(data.value.companyName == "usa today"){
            textValue = "USA Today";
          }
          else if(data.value.companyName.length > 30){
            textValue = data.value.companyName.replace(/\b\w/g, l => l.toUpperCase()).slice(0,30)+"..."
          }
          else {
            textValue = data.value.companyName.replace(/\b\w/g, l => l.toUpperCase())
          }
          if(oldData == -1){
            textValue = textValue + "<span>2017 data</span>"
          }
          return textValue;

        });

      var colData = ["white","black","hisp.","asian","female"];
      var dataForToolTip = [{cut:"leaders",cols:colData},{cut:"staff",cols:colData},{cut:"census",cols:colData}];

      var rows = chartToolTipContainer.selectAll("div")
        .data(dataForToolTip)
        .enter()
        .append("div")
        .attr("class","swarm-chart-tool-tip-row")

      var rowLabels = rows.append("p")
        .attr("class","swarm-chart-tool-tip-row-label")
        .html(function(d){
          if(d.cut == "census"){
            var cityString = "";
            if(data.value.companyData.hasOverride){

              cityString = data.value.companyData.override.coverage_area;
              if(cityString > 30){
                cityString = cityString.slice(0,27)+"..."
              }
            }
            else {
              cityString = data.value.companyData.City + ", "+data.value.companyData.State;
            }
            return "census<span>"+cityString+"</span>"
          }
          if(d.cut == "staff" && chartType != "swarm-scatter"){
            return "all"
          }
          return d.cut;
        })
        ;

      var cols = rows.selectAll("div")
        .data(function(d){
          return d.cols;
        })
        .enter()
        .append("div")
        .attr("class","swarm-chart-tool-tip-col")

      cols.append("p")
        .attr("class","swarm-chart-tool-tip-col-label")
        .text(function(d){
          if(d3.select(this.parentNode.parentNode).datum().cut == "leaders"){
            return d;
          }
          return null;
        })
        ;

      cols
        .append("p")
        .text(function(d){
          var cutData = d3.select(this.parentNode.parentNode).datum().cut;
          if(cutData == "census"){
            if(d=="female"){
              var femaleData = data.value.femaleCensus;
              if(femaleData == "n/a"){
                return femaleData;
              }
              return Math.round(data.value.femaleCensus*100)+"%";
            }
            if(d=="white"){
              return Math.round(data.value.whiteCensus*100)+"%";
            }
            if(d=="hisp."){
              return Math.round(data.value.hispanicCensus*100)+"%";
            }
            if(d=="black"){
              return Math.round(data.value.blackCensus*100)+"%";
            }
            if(d=="asian"){
              return Math.round(data.value.asianCensus*100)+"%";
            }
          }
          if(cutData == "staff"){
            if(chartType == "swarm-scatter"){
              if(d=="white"){
                return Math.round((getPercentType("whiteStaff",data.value))*100)+"%";
              }
              if(d=="black"){
                return Math.round((getPercentType("blackStaff",(data.value)))*100)+"%";
              }
              if(d=="hisp."){
                return Math.round((getPercentType("hispStaff",(data.value)))*100)+"%";
              }
              if(d=="asian"){
                return Math.round((getPercentType("asianStaff",(data.value)))*100)+"%";
              }
              if(d=="female"){
                return Math.round((getPercentType("genderStaff",(data.value)))*100)+"%";
              }
            }
            if(d=="white"){
              return Math.round((getPercentType("white",data.value))*100)+"%";
            }
            if(d=="black"){
              return Math.round((getPercentType("black",(data.value)))*100)+"%";
            }
            if(d=="hisp."){
              return Math.round((getPercentType("hisp",(data.value)))*100)+"%";
            }
            if(d=="asian"){
              return Math.round((getPercentType("asian",(data.value)))*100)+"%";
            }
            if(d=="female"){
              return Math.round((getPercentType("gender",(data.value)))*100)+"%";
            }
          }
          if(cutData = "leaders"){
            if(d=="white"){
              return Math.round((getPercentType("supWhiteRaw",data.value))*100)+"%";
            }
            if(d=="black"){
              return Math.round((getPercentType("supBlack",(data.value)))*100)+"%";
            }
            if(d=="hisp."){
              return Math.round((getPercentType("supHisp",(data.value)))*100)+"%";
            }
            if(d=="asian"){
              return Math.round((getPercentType("supAsian",(data.value)))*100)+"%";
            }
            if(d=="female"){
              return Math.round((getPercentType("supGender",(data.value)))*100)+"%";
            }
          }
          return "tbd";
        })
        .attr("class","swarm-chart-tool-tip-text")
        ;

      if(chartType == "swarm" || chartType == "new"){

        element.style("stroke",function(){
          return "black";
        })
        ;

        chartToolTip
          .style("visibility","visible")
          .style("top",function(d){
            if(viewportWidth < 450 || mobile){
              return "0px";
            }
            return data.y + mouseoverOffsetY +"px"
          })
          .style("left",function(d){
            if(viewportWidth < 450 || mobile){
              return "0px";
            }
            return data.x + data.value.radius + mouseoverOffsetX +"px";
          })
      }
      else if(chartType == "swarm-scatter"){

        element.style("stroke",function(){
          return "black";
        })
        ;
        chartToolTip
          .style("visibility","visible")
          .style("top", function(){
            if(viewportWidth < 450 || mobile){
              return "0px";
            }
            if(cut=="race"){
              return yScale(getPercentType("supWhite",data.value)) + mouseoverOffsetY +"px"
            }
            return yScale(getPercentType("supGender",data.value)) + mouseoverOffsetY +"px"
          })
          .style("left",function(){
            if(viewportWidth < 450 || mobile){
              return "0px";
            }
            if(cut=="race"){
              return xScale(getPercentType("raceStaff",data.value)) + data.value.radius + mouseoverOffsetX +"px"
            }
            return xScale(getPercentType("genderStaff",data.value)) + data.value.radius + mouseoverOffsetX +"px"
          })
      }
    }
    function mouseOutEvents(data,element){

      chartToolTip
        .style("visibility",null)
        ;

      if(chartType == "swarm" || chartType == "new"){

        element
          .style("stroke",function(d){
            var value = getPercentType(cut,d.value);
            if(+d.key == newsIDSearch){
              return newsIDSearchColor;
            }
            if(d.key == newsIdSelected){
              return d3.color(genderColorScale(value)).darker(highlightedCircleStrokeDarkness);
            }
            return d3.color(genderColorScale(value)).darker(1);
          })
          ;

      }
      else if(chartType == "swarm-scatter"){
        element
          .style("stroke",function(d){
            var value = getPercentType(cut,d.value);
            if(+d.key == newsIDSearch){
              return newsIDSearchColor;
            }
            if(d.key == newsIdSelected){
              return d3.color(genderColorScale(value)).darker(highlightedCircleStrokeDarkness);
            }
            return null;
          })
          ;
      }
      else if(chartType == "arrow-scatter"){
        // element
        //   .style("stroke",null)
        //   ;
      }
    }

    function changeTitle(){
      var title = "Newsroom <span>Gender</span> Breakdown";
      if(cut=="race"){
        if(viewportWidth > 450){
          title = "Newsroom <span>White/Non-White</span> Breakdown vs. Audience";
        }
        else{
          title = "Newsroom <span>Racial</span> Breakdown vs. Audience";
        }

      }
      if(chartType == "swarm-scatter"){
        title = "Newsroom <span>Leadership</span> vs. Staff";
        // if(cut == "race"){
        //   title = "Racial Break-down of Staff vs. <span>Leaders</span>";
        // }
      }
      // else if(chartType == "mini-multiple"){
      //   title = "<span>Change</span> in Gender Breakdown from 2002 - 2017"
      // }
      else if(chartType == "arrow-scatter"){
        title = "How Newsrooms <span>Changed, "+yearOld+" - "+yearSelected+"</span>"
        // title = "How Newsrooms <span>Changed, "+yearOld+" - "+yearSelected+"</span><span class='chart-title-note'><span class='red'>*</span>Newsroom Uses 2017 Data</span>"
      }
      else if(chartType == "arrow-scatter-full"){
        title = "How Newsrooms <span>Changed, "+yearOld+" - "+yearSelected+"</span>"
        // title = "How Newsrooms <span>Changed, "+yearOld+" - "+yearSelected+"</span><span class='chart-title-note'><span class='red'>*</span>Newsroom Uses 2017 Data</span>"
      }
      else if(chartType == "table"){
        title = "Individual Newsroom Demographics"
        // title = "Individual Newsroom Demographics<span class='chart-title-note'><span class='red'>*</span>Newsroom Uses 2017 Data</span>"
      }
      chartTitle.html(title);
    }
    function setWidths(chartType){
      if(cut=="gender"){
        if(chartType == "swarm-scatter"){
          extentOverride = d3.extent(newsNest,function(d){
            return getPercentType("genderStaff",d.value)
          });

        }
        else{
          extentOverride = d3.extent(newsNest,function(d){ return getPercentType("gender",d.value)});
        }
      }
      else{
        extentOverride = d3.extent(newsNest,function(d){ return getPercentType("race",d.value)});
      }

      if(chartType == "swarm" || chartType == "new"){
        margin = {top: 40, right: 20, bottom: 50, left: 20};
        width = 1000 - margin.left - margin.right;
        height = 325 - margin.top - margin.bottom;
        if(viewportWidth < 1000){
          width = viewportWidth - margin.left - margin.right;
        }
        if(viewportWidth < 400 || mobile){
          height = 400 - margin.top - margin.bottom;
        }
        if(cut == "race"){
          xScale.domain([-.7,.7]).range([0,width]).clamp(true);
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.whiteDelta;});
          genderColorScale.domain([-.7,0,.7]);
        }
        else if(cut == "gender"){
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return getPercentType("gender",d.value)});
          xScale.domain([.2,.8]).range([0,width]).clamp(true);
          if(extentOverride[0] < .2){
            xScale.domain([extentOverride[0],.8]);
          }
          if(extentOverride[1] > .8){
            xScale.domain([.2,extentOverride[1]]);
          }
          if(extentOverride[0] < .2 && extentOverride[1] > .8){
            xScale.domain([extentOverride[0],extentOverride[1]]);
          }
          genderColorScale.domain([.2,.5,.8]);
        }
      }
      else if(chartType == "swarm-scatter"){
        newToggleForRaceAndGender.classed("swarm-scatter-selected",true);
        margin = {top: 0, right: 20, bottom: 60, left: 20};
        width = 680 - margin.left - margin.right;
        if(viewportWidth < 680){
          margin = {top: 30, right: 20, bottom: 60, left: 20};
          width = viewportWidth - margin.left - margin.right;
        }
        height = 575 - margin.top - margin.bottom;
        if(viewportWidth < 680){
          height = 475 - margin.top - margin.bottom;
        }
        xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
        yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);
        if(cut == "race"){
          xScale.domain([0,.85]).range([0,width]).clamp(true);
          yScale.domain([0,.85]).range([height,0]).clamp(true);
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return getPercentType("raceStaff",d.value)});
          newsNestSupAverageT1 = d3.mean(newsNest,function(d){ return getPercentType("supWhite",d.value)});
        }
        else{
          xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
          yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);
          if(extentOverride[0] <.2){
            xScale.domain([extentOverride[0],.8])
          }
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return getPercentType("genderStaff",d.value)});
          newsNestSupAverageT1 = d3.mean(newsNest,function(d){ return getPercentType("supGender",d.value)});
        }
      }
      else if(chartType=="arrow-scatter"){
        newToggleForRaceAndGender.classed("arrow-scatter-selected",true);
        margin = {top: 70, right: 100, bottom: 40, left: 200};
        width = 950 - margin.left - margin.right;
        if(viewportWidth < 950){
          margin = {top: 70, right: 20, bottom: 40, left: 200};
          width = viewportWidth - margin.left - margin.right;
        }
        if(viewportWidth < 450){
          margin = {top: 65, right: 20, bottom: 40, left: 150};
          width = viewportWidth - margin.left - margin.right;
        }
        height = 450 - margin.top - margin.bottom;
        xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
        yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);
        if(viewportWidth < 600){
          xScale = d3.scaleLinear().domain([.25,.75]).range([0,width]).clamp(true);
          yScale = d3.scaleLinear().domain([.25,.75]).range([height,0]).clamp(true);
        }
        if(cut=="gender"){
          if(extentOverride[0] <.2){
            xScale.domain([extentOverride[0],.8])
          }
          else if(extentOverride[1] > .8){
            xScale.domain([.2,extentOverride[1]])
          }
          else if(extentOverride[1] > .8 && extentOverride[0] <.2){
            xScale.domain([extentOverride[0],extentOverride[1]])
          }
        }
        if(cut == "race"){
          xScale.domain([-1,1]).range([0,width]).clamp(true);
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.whiteDelta;});
          genderColorScale.domain([-1,0,1]);
          if(viewportWidth < 820){
            xScale.domain([-1,0]).range([0,width]).clamp(true);
          }
        }
      }
      else if(chartType=="arrow-scatter-full"){

        margin = {top: 70, right: 150, bottom: 40, left: 150};
        width = 950 - margin.left - margin.right;
        if(viewportWidth < 950){
          newToggleForRaceAndGender.classed("arrow-scatter-full-selected",true);
          margin = {top: 70, right: 50, bottom: 40, left: 50};
          width = viewportWidth - margin.left - margin.right;
        }
        if(viewportWidth < 400){
          newToggleForRaceAndGender.classed("arrow-scatter-full-selected",false);
          margin = {top: 50, right: 50, bottom: 40, left: 10};
          width = viewportWidth - margin.left - margin.right;
        }
        if(viewportWidth < 700){
          if(cut=="race"){
            margin = {top: 50, right: 10, bottom: 40, left: 10};
            width = viewportWidth - margin.left - margin.right;
          }
        }
        height = 450 - margin.top - margin.bottom;
        xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
        yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);

        if(cut=="gender"){
          if(extentOverride[0] <.2){
            xScale.domain([extentOverride[0],.8])
          }
          else if(extentOverride[1] > .8){
            xScale.domain([.2,extentOverride[1]])
          }
          else if(extentOverride[1] > .8 && extentOverride[0] <.2){
            xScale.domain([extentOverride[0],extentOverride[1]])
          }
        }

        newsNestAverageT0 = d3.mean(newsNest,function(d){
          if(d.value.previousYear == "n/a"){
            return null;
          }
          return d.value.previousYear;
        });
        newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.currentYear;});
        if(cut == "race"){
          xScale.domain([-1,1]).range([0,width]).clamp(true);
          if(viewportWidth < 700){
            xScale.domain([-1,.35]).range([0,width]).clamp(true);
          }
          if(viewportWidth < 450){
            xScale.domain([-.75,.35]).range([0,width]).clamp(true);
          }
          newsNestAverageT0 = d3.mean(newsNest,function(d){
            var result = getPercentType("race-old",d.value);
            if(result == "n/a"){
              return null;
            }
            return result;
          });
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.whiteDelta;});
          genderColorScale.domain([-1,0,1]);
        }
      }
      else if(chartType=="table"){
        if(viewportWidth < 700){
          newToggleForRaceAndGender.classed("table-selected",true);
          margin = {top: 70, right: 50, bottom: 40, left: 50};
          width = viewportWidth - margin.left - margin.right;
        }
        chartDivContainerTable.transition().duration(0).style("opacity",1);
        margin = {top: 40, right: 20, bottom: 20, left: 20};
        width = 1000 - margin.left - margin.right;
        height = 250 - margin.top - margin.bottom;
        if(urlParamEmbed!=""){
          height = 210 - margin.top - margin.bottom;
        }
        if(viewportWidth < 1000){
          margin = {top: 40, right: 20, bottom: 20, left: 20};
          width = viewportWidth - margin.left - margin.right;
        }
        if(viewportWidth < 700){
          margin = {top: 160, right: 20, bottom: 20, left: 20};
          width = viewportWidth - margin.left - margin.right;
          height = 280 - margin.top - margin.bottom;
          if(urlParamEmbed!=""){
            height = 210 - margin.top - margin.bottom;
          }
        }
        if(viewportWidth < 450){
          margin = {top: 160, right: 20, bottom: 20, left: 20};
          width = viewportWidth - margin.left - margin.right;
          height = 210 - margin.top - margin.bottom;
        }

        xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
        yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);
        radiusScale.range([4,27]);
        toggleType.style("visibility","hidden");
        searchMap.style("display","block");
      }
      if(chartType!="table" && chartType != "new"){
        radiusScale.range([4,27]);
        searchMap.style("display",null);
        toggleType.style("visibility",null);
        chartDivContainerTable.transition().duration(0).style("opacity",0);
        ;
      }
      if(chartType!="arrow-scatter" && chartType !="arrow-scatter-full" && chartType != "new"){
        cellLine.transition().duration(0).style("opacity",0);
      }
      if(chartType!="arrow-scatter" && chartType != "new"){
        cellCircleTwo.transition().duration(0).style("opacity",0);
        cell.style("opacity",null);
        cellText.transition().duration(0).style("opacity",0);
      }
      if(chartType!="arrow-scatter-full" && chartType != "new"){
        cellText.style("transform",null);
        cellDash.style("opacity",0)
      }
      if(chartType == "swarm-scatter" || chartType == "arrow-scatter" || chartType == "arrow-scatter-full"){
        searchResultsContainer.classed("search-results-top-shift",true)
      }
      else if (chartType != "new"){
        searchResultsContainer.classed("search-results-top-shift",false)
      }

      if(viewportWidth > 450){
        chartTitle.transition().duration(500)
          .style("width",width+"px")
          .style("left",0+"px")
          .style("text-align",null)
      }
      else{
        if(chartType == "table"){
          chartTitle.transition().duration(500)
            .style("width","90%")
            .style("left",0+"px")
            .style("text-align","center")
        }
        else{
          chartTitle.transition().duration(500)
            .style("width","90%")
            .style("left",0+"px")
            .style("text-align",null)
        }

      }

      if(chartType!="swarm-scatter" && chartType != "new"){
        newToggleForRaceAndGender.classed("swarm-scatter-selected",false);
      }
      if(chartType!="arrow-scatter" && chartType != "new"){
        newToggleForRaceAndGender.classed("arrow-scatter-selected",false);
      }
      if(chartType!="arrow-scatter-full" && chartType != "new"){
        newToggleForRaceAndGender.classed("arrow-scatter-full-selected",false);
      }
      if(chartType!="table" && chartType != "new"){
        newToggleForRaceAndGender.classed("table-selected",false);
      }

      if(chartType == "new"){

      }
      else if(chartType=="arrow-scatter-full" || chartType == "arrow-scatter"){
        searchResultText.style("pointer-events",function(d){
            var result = getPercentType("gender-old",d.value);
            if(result=="n/a"){
              return "none";
            }
            return null;
          })
          .text(function(d){
            var result = getPercentType("gender-old",d.value);
            if(result == "n/a"){
              return "(Unavail: No 2001 Data) "+d.value.companyName.replace(/\b\w/g, l => l.toUpperCase())
            }
            return d.value.companyName.replace(/\b\w/g, l => l.toUpperCase())
          })
          ;
      }
      else{
        searchResultText
          .style("pointer-events",null)
          .text(function(d){
            return d.value.companyName.replace(/\b\w/g, l => l.toUpperCase())
          })
          ;
      }

      chartDivContainer
        .transition()
        .duration(duration)
        // .delay(duration)
        .style("width",width+margin.left+margin.right+"px")

      chartToolTip
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;

      chartDiv
        .transition()
        .duration(duration)
        .attr("height",height+margin.top+margin.bottom)
        // .transition()
        // .duration(duration)
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

    changeTitle();

    setWidths(chartType);

    if(chartType == "swarm-scatter"){

      cellCircle = cell.selectAll(".swarm-circle")
        .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        });

      cellCircle
        .transition()
        .duration(duration)
        .delay(function(d,i){
          if(urlParam!=""){
            return 0;
          }
          return i*10;
        })
        .style("opacity",1)
        .attr("cx", function(d) {
          if(cut == "race"){
            return xScale(getPercentType("raceStaff",d.value));
          }
          return xScale(getPercentType("genderStaff",d.value));
        })
        .attr("r", function(d){
          return d.value.radius
        })
        .attr("cy", function(d) {
          if(cut == "race"){
            return yScale(getPercentType("supWhite",d.value));
          }
          return yScale(getPercentType("supGender",d.value));
        })
        .style("fill",function(d){
          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          return null;
        })
        .style("stroke",function(d){
          var value = getPercentType(cut,d.value);

          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          if(+d.key == newsIdSelected){
            return d3.color(genderColorScale(value)).darker(highlightedCircleStrokeDarkness);
          }
          return null;
        })
        .style("stroke-width",function(d){
          if(d.key==newsIdSelected){
            return "2px";
          }
          return null;
        })
        .each(function(d){
          if(d.key == newsIdSelected){
            var item = d3.select(this);

            var y = 0;
            var x = 0;
            if(cut == "race"){
              y = yScale(getPercentType("supWhite",d.value));
            }
            else{
              y = yScale(getPercentType("supGender",d.value));
            }

            if(cut == "race"){
              x = xScale(getPercentType("raceStaff",d.value));
            }
            else{
              x = xScale(getPercentType("genderStaff",d.value));
            }
            highlightedPosition = [x,y,d.value.radius];
          }
        })
        ;

      cellCircle
        .filter(function(d){
          return +d.key == newsIDSearch;
        })
        .style("stroke-opacity",.5)
        .style("z-index",1000000000)
        .transition("border")
        .duration(1000)
        .style("stroke-width","10px")
        .transition("border")
        .duration(1000)
        .style("stroke-width","1px")
        .style("stroke-opacity",1)
        ;

      cellImages = cell.selectAll(".swarm-image-container")

      cellImages
        .transition()
        .duration(duration)
        .style("opacity",1)
        .attr("transform", function(d){
          if(cut=="race"){
            return "translate(" + xScale(getPercentType("raceStaff",d.value)) + "," + yScale(getPercentType("supWhite",d.value)) + ")"
          }
          return "translate(" + xScale(getPercentType("genderStaff",d.value)) + "," + yScale(getPercentType("supGender",d.value)) + ")"
        })
        ;

      // if(rebuildAxis){
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
      // }

      function buildAxis(){

        var chartAxisContainer = chartAxis.append("g")

        var chartAxisLines = chartAxisContainer.append("g")

        chartAxisLines
          .append("g")
          .attr("class","swarm-scatter-rect-gender-g")
          .append("line")
          .attr("class","swarm-scatter-rect-gender-line")
          .attr("x1",0)
          .attr("x2",width)
          .attr("y1",function(d){
            return height/2;
          })
          .attr("y2",function(d){
            return height/2;
          })
          .style("visibility",function(){
            if(cut=="race"){
              return "hidden"
            }
            return null;
          })
          ;

        chartAxisLines
         .append("g")
         .attr("class","swarm-scatter-x-axis-lines")
         .selectAll("line")
         .data(function(){
           if(cut=="race"){
             return [.1,.3,.5,.7]
           }
           return [.25,.35,.45,.55,.65,.75];
         })
         .enter()
         .append("line")
         .attr("x1",function(d){
           return xScale(d);
         })
         .attr("x2",function(d){
           return xScale(d);
         })
         .attr("y1",0)
         .attr("y2",height)
         .attr("class","swarm-axis-line")
         ;

        chartAxisLines.append("g")
          .attr("class","swarm-scatter-y-axis-lines")
          .selectAll("line")
          .data(function(){
            if(cut=="race"){
              return [.1,.3,.5,.7];
            }
            return [.3,.5,.4,.6,.7];
          })
          .enter()
          .append("line")
          .attr("x1",0)
          .attr("x2",width)
          .attr("y1",function(d){
            return yScale(d);
          })
          .attr("y2",function(d){
            return yScale(d);
          })
          .attr("class","swarm-axis-line")
          ;

        var chartAxisText = chartAxisContainer.append("g")

        chartAxisText
          .append("g")
          .selectAll("text")
          .data(function(){
            if(viewportWidth < 450){
              if(cut=="race"){
                return ["← More White","Staff Race","More Non-white →"]
              }
              return ["← More Male Staff","Staff Gender","More Female Staff →"]
            }
            if(cut=="race"){
              return ["← More White","Staff Race","More People of Color →"]
            }
            return ["← More Male Staff","Staff Gender","More Female Staff →"]
          })
          .enter()
          .append("text")
          .attr("x",function(d,i){
            if(i==0){
              return 0;
            }
            if(i==1){
              return width/2;
            }
            return width;
          })
          .attr("y",function(d,i){
            return height
          })
          .attr("class",function(d,i){
            if(i!=1){
              return "swarm-axis-tick-text scatter-axis-chart-text scatter-axis-chart-side"
            }
            return "swarm-axis-tick-text scatter-axis-chart-text";
          })
          .text(function(d){
            return d;
          })
          .style("text-anchor",function(d,i){
            if(i==0){
              return "start"
            }
            if(i!=1){
              return "end";
            }
            return "middle"
          })
          ;

        chartAxisText
          .append("g")
          .selectAll("text")
          .data(function(){
            if(cut=="race"){
              return [{text:"75% Leaders are Not White",value:.75},{text:"Leaders: 50-50 White/Non-White",value:.5},{text:"25% Non-White",value:.25},{text:"0% Non-White Leaders",value:.0}]
            }
            return [{text:"75% Leaders are Women",value:.75},{text:"65% Female",value:.65},{text:"Leaders: 50-50 Male/Female",value:.5},{text:"35% Female",value:.35},{text:"25% Leaders are Female",value:.25}]
          })
          .enter()
          .append("text")
          .attr("transform","translate("+(width-10)+",0)")
          .attr("y",function(d,i){
            return yScale(d.value);
          })
          .attr("class",function(d,i){
            return "swarm-axis-tick-text scatter-axis-chart-text-y";
          })
          .style("text-anchor",function(d,i){
            return "end"
          })
          .text(function(d){
            return d.text;
          })
          .attr("dy",0)
          .call(wrap,95)
          ;
      }

      function buildAverage(){

         chartDiv.select(".swarm-average").remove();
         chartDiv.select(".swarm-annnotation").remove();

         function leastSquares(xSeries, ySeries) {
       		var reduceSumFunc = function(prev, cur) { return prev + cur; };

       		var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
       		var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

       		var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
       			.reduce(reduceSumFunc);

       		var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
       			.reduce(reduceSumFunc);

       		var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
       			.reduce(reduceSumFunc);

       		var slope = ssXY / ssXX;
       		var intercept = yBar - (xBar * slope);
       		var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

       		return {slope:slope,intercept:intercept,r2:rSquare};
       	}
         var xValues = cellCircle.data().map(function(d){
           if(cut=="race"){
             return getPercentType("raceStaff",d.value);
           }
           return getPercentType("genderStaff",d.value);
         });
         var yValues = cellCircle.data().map(function(d){
           if(cut=="race"){
             return getPercentType("supWhite",d.value);
           }
           return getPercentType("supGender",d.value);
         });
         var linear = leastSquares(xValues,yValues);


         var chartAverage = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             ;

         var chartAnnotation = chartAverage.append("g")
          .attr("class","swarm-annnotation")
          ;


        chartAverage.append("line")
          .attr("class","swarm-scatter-regression-line")
          .attr("x1", 0)
          .attr("y1", yScale(linear.intercept))
          .attr("x2", function(d){
            if(cut=="race"){
              return xScale(.85)
            }
            return xScale(.85)
          })
          .attr("y2", function(){
            if(cut=="race"){
              return yScale( (.85 * linear.slope) + linear.intercept )
            }
            return yScale( (.85 * linear.slope) + linear.intercept )
          })
          ;

        var regressionAnnotation = chartAnnotation.append("g")
          .attr("class","swarm-scatter-regression-annotation")
          .attr("transform",function(){
            if(cut=="race"){
              return "translate("+xScale(.8*.8)+","+yScale( (.8*.8 * linear.slope) + linear.intercept )+")"
            }
            return "translate("+xScale(.8*.8)+","+yScale( (.8*.8 * linear.slope) + linear.intercept )+")"
          })

        regressionAnnotation
          .append("text")
          .attr("class","swarm-scatter-regression-annotation-text")
          .text(function(){
            if(cut=="race"){
              return "Newsrooms with racially diverse leadership tend to have a racially diverse staff"
            }
            return "Newsrooms with female leadership tend to have more women on staff"
          })
          .attr("transform","translate("+-40+","+-55+")")
          .attr("dy",0)
          .call(wrapTwo,250)
          ;

        regressionAnnotation
          .append("line")
          .attr("class","swarm-scatter-regression-annotation-line")
          .attr("x1", -35)
          .attr("y1", -35)
          .attr("x2", -5)
          .attr("y2", -5)
          .attr("marker-end","url(#arrow-head-black)")
          ;

        var highlightedAnnotationOffset = 150;
        //
        var highlightedAnnotation = chartAverage.append("g")
           .attr("transform","translate("+highlightedPosition[0]+","+highlightedPosition[1]+")")
        //
        highlightedAnnotation
          .append("line")
          .attr("class","swarm-axis-annotation-line")
          .attr("x1",highlightedPosition[2])
          .attr("x2",highlightedPosition[2] + highlightedAnnotationOffset)
          .attr("y1",0)
          .attr("y2",0)
          .style("stroke",highlightedStrokeColor)
          ;
        //
        highlightedAnnotation
         .append("text")
         .text(function(d){
           return newsIDName.get(newsIdSelected).Company
         })
         .attr("class","swarm-axis-annotation-text")
         .attr("x",highlightedPosition[2] + highlightedAnnotationOffset)
         .style("text-anchor","start")
         ;

        // chartAnnotation.append("line")
        //   .attr("x1",function(){
        //     if(cut=="race"){
        //       return xScale(.5);
        //     }
        //     return xScale(.65);
        //   })
        //   .attr("x2",function(){
        //     if(cut=="race"){
        //       return xScale(.55)
        //     }
        //     return xScale(.7)
        //   })
        //   .attr("y1",height-20)
        //   .attr("y2",height-20)
        //   .attr("class","swarm-annnotation-line")
        //   .attr("marker-end", function(d){
        //     return "url(#arrow-head)"
        //   })
        //   ;

        // chartAnnotation.append("text")
        //   .style("transform",function(){
        //     if(cut == "race"){
        //       var transform = "translate("+(xScale(.5)-10)+"px,"+(height-20)+"px) rotate(0)";
        //       return transform;
        //     }
        //     var transform = "translate("+(xScale(.65)-10)+"px,"+(height-20)+"px) rotate(0)";
        //     return transform;
        //   })
        //   .attr("class","swarm-annnotation-text swarm-scatter-y-annnotation-text")
        //   .text(function(d){
        //     if(cut=="race"){
        //       return "People of Color Staff"
        //     }
        //     return "Women Staff";
        //   })
        //   ;
        //
         chartAnnotation.append("line")
           .attr("x1",20)
           .attr("x2",20)
           .attr("y1",function(){
             if(cut=="race"){
               return yScale(.7);
             }
             return yScale(.75);
           })
           .attr("y2",15)
           .attr("class","swarm-annnotation-line")
           .attr("marker-end", function(d){
             return "url(#arrow-head)"
           })
           ;

         chartAnnotation.append("text")
           .style("transform",function(){
             if(cut == "race"){
               var transform = "translate("+20+"px,"+(yScale(.7)+10)+"px) rotate(270deg)";
               return transform;
             }
             var transform = "translate("+20+"px,"+(yScale(.75)+10)+"px) rotate(270deg)";
             return transform;
           })
           .attr("class","swarm-annnotation-text swarm-scatter-y-annnotation-text")
           .text(function(d){
             if(cut=="race"){
               return "People of Color Leadership"
             }
             return "Women Leaders";
           })
           ;

         chartAverage.append("circle")
           .attr("class","swarm-circle swarm-circle-average")
           .attr("cx",xScale(newsNestAverageT1))
           .attr("cy",function(d){
             return yScale(newsNestSupAverageT1);
           })
           .attr("r",6)
           ;

         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x",xScale(newsNestAverageT1))
           .attr("y",yScale(newsNestSupAverageT1) - 12)
           .style("fill","black")
           .text("Average")

      }

      buildAverage();


    }
    else if(chartType == "swarm"){

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

      function buildAxis(){


          var chartAxisContainer = chartAxis.append("g")

          var tickData = [.2,.3,.5,.7,.8];
          if(extentOverride[0] < .2 || extentOverride[1] > .8){
            var tickData = [.2,.5,.8];
          }
          var midPoint = .5
          if(cut == "race"){
            tickData = [-.7,-.25,0,.25,.7];
            midPoint = 0
          }
          if(viewportWidth < 700){
            tickData = [.2,.5,.8];
            if(cut == "race"){
              tickData = [-1,0,1];
              midPoint = 0
            }
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
                  if(viewportWidth < 450){
                    return "+"+Math.floor(Math.abs(d)*100)+" pts. White";
                  }
                  return "More White vs. City* Census"
                }
                return Math.floor((1-d)*100)+"% Male Staff"
              }
              if(i==tickData.length-1){
                if(cut == "race"){
                  if(viewportWidth < 450){
                    return "+"+Math.floor(Math.abs(d)*100)+" pts. Non-white";
                  }
                  return "More People of Color vs. City* Census"
                }
                return Math.floor(d*100)+"% Female Staff"
              }
              if(d==midPoint){
                if(cut == "race"){
                  return "Parity with City*"
                }
                return "50/50  Split";
              }
              if(d<midPoint){
                if(cut == "race"){
                  return "+"+Math.floor(Math.abs(d)*100)+" pts.";
                }
                return Math.floor((1-d)*100)+"%";
              }
              if(cut == "race"){
                return "+"+Math.floor(Math.abs(d)*100)+" pts.";
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

      // if(rebuildAxis){
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
      // }

      for (var i = 0; i < 250; ++i) simulation.tick();

      cell
        .each(function(d){
          if(d.key == newsIdSelected){
            highlightedPosition = [d.x,d.y,d.value.radius];
          }
        })
        ;

      cellCircle = cell.selectAll(".swarm-circle")
        .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        })

      cellCircle
        .transition()
        .duration(duration)
        .style("opacity", 1)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill",function(d){
          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          var value = getPercentType(cut,d.value);
          return genderColorScale(value);
        })
        .attr("r", function(d){
          return d.value.radius
        })
        .style("stroke",function(d){
          var value = getPercentType(cut,d.value);
          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          if(d.key == newsIdSelected){
            return d3.color(genderColorScale(value)).darker(highlightedCircleStrokeDarkness);
          }
          return d3.color(genderColorScale(value)).darker(1);
        })
        .style("stroke-width",function(d){
          if(d.key==newsIdSelected){
            return "2px";
          }
          return null;
        })
        ;

      cellCircle
        .filter(function(d){
          return +d.key == newsIDSearch;
        })
        .style("stroke-opacity",.5)
        .transition("border")
        .duration(1000)
        .style("stroke-width","10px")
        .transition("border")
        .duration(1000)
        .style("stroke-width","1px")
        .style("stroke-opacity",1)
        ;

      cellImages = cell.selectAll(".swarm-image-container")

      cellImages
        .transition()
        .duration(duration)
        .style("opacity", 1)
        .attr("transform", function(d){
          return "translate(" + d.x + "," + d.y + ")"
        })
        ;

      function buildAverage(){

          chartDiv.select(".swarm-average").remove();
          chartDiv.select(".swarm-annnotation").remove();

          var chartAnnotation = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-annnotation")
             ;

          if(!mobile && viewportWidth > 550){
            var adjustWidth = 0;
            if(viewportWidth < 650){
              adjustWidth = 100;
            }

            chartAnnotation.append("line")
              .attr("x1",width-147+adjustWidth)
              .attr("x2",width-10)
              .attr("y1",height/2+25)
              .attr("y2",height/2+25)
              .attr("class","swarm-annnotation-line")
              .attr("marker-end", function(d){
                return "url(#arrow-head)"
              })
              ;

            chartAnnotation.append("text")
              .attr("x",width-147+adjustWidth)
              .attr("y",height/2+25)
              .attr("class","swarm-annnotation-text")
              .text(function(d){
                if(cut == "race"){
                  return "More People of Color";
                }
                return "More Women";
              })
              ;
          }

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
          .text(newsIDName.get(newsIdSelected).Company)
          .attr("class","swarm-axis-annotation-text")
          .attr("y",highlightedAnnotationOffset+10)
          ;

         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x",xScale(newsNestAverageT1))
           .attr("y",height*.2-22)
           .text("Average")

        chartAverage.append("text")
          .attr("class","swarm-average-text")
          .attr("x",xScale(newsNestAverageT1))
          .attr("y",height*.2-7)
          .text(function(){
            if(cut == "race"){
              return Math.round((Math.abs(newsNestAverageT1))*100)+" pts. over-represented white"
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
    else if(chartType == "new"){

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

      function buildAxis(){

       var chartAxisContainer = chartAxis.append("g")

       var tickData = [.2,.3,.5,.7,.8];
       var midPoint = .5
       if(cut == "race"){
         tickData = [-.7,-.25,0,.25,.7];
         if(viewportWidth < 750){
           tickData = [-.7,-.25,0,.25,.7];
         }
         midPoint = 0
       }
       if(viewportWidth < 700){
         tickData = [.2,.5,.8];
         if(cut == "race"){
           tickData = [-.7,0,.7];
           midPoint = 0
         }
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
                if(viewportWidth < 750){
                  return "+"+Math.floor(Math.abs(d)*100)+" pts. White";
                }
                return "More White vs. City* Census"
              }
              return Math.floor((1-d)*100)+"% Male Staff"
            }
            if(i==tickData.length-1){
              if(cut == "race"){
                if(viewportWidth < 750){
                  return "+"+Math.floor(Math.abs(d)*100)+" pts. Non-white";
                }
                return "More People of Color vs. City* Census"
              }
              return Math.floor(d*100)+"% Female Staff"
            }
            if(d==midPoint){
              if(cut == "race"){
                return "Parity with City*"
              }
              return "50/50  Split";
            }
            if(d<midPoint){
              if(cut == "race"){
                return "+"+Math.floor(Math.abs(d)*100)+" pts.";
              }
              return Math.floor((1-d)*100)+"%";
            }
            if(cut == "race"){
              return "+"+Math.floor(Math.abs(d)*100)+" pts.";
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
          chartDiv.select(".swarm-annnotation").remove();

          var chartAnnotation = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-annnotation")
             ;

          if(!mobile && viewportWidth > 550){
            var adjustWidth = 0;
            if(viewportWidth < 650){
              adjustWidth = 100;
            }
            chartAnnotation.append("line")
              .attr("x1",width-147+adjustWidth)
              .attr("x2",width-10)
              .attr("y1",height/2+25)
              .attr("y2",height/2+25)
              .attr("class","swarm-annnotation-line")
              .attr("marker-end", function(d){
                return "url(#arrow-head)"
              })
              ;

            chartAnnotation.append("text")
              .attr("x",width-147+adjustWidth)
              .attr("y",height/2+25)
              .attr("class","swarm-annnotation-text")
              .text(function(d){
                if(cut == "race"){
                  return "More People of Color";
                }
                return "More Women";
              })
              ;

          }

          var chartAverage = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             ;

         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x",xScale(newsNestAverageT1))
           .attr("y",height*.2-22)
           .text("Average")

          chartAverage.append("text")
            .attr("class","swarm-average-text")
            .attr("x",xScale(newsNestAverageT1))
            .attr("y",height*.2-7)
            .text(function(){
              if(cut == "race"){
                return Math.round((Math.abs(newsNestAverageT1))*100)+" pts. over-represented white"
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

          var result = {
          	ip: '24.194.26.74',
          	country_code: 'US',
          	country_name: 'United States',
          	region_code: 'CA',
          	region_name: 'Massachusetts',
          	city: 'New York',
          	zip_code: '01230',
          	time_zone: 'America/New_York',
           latitude: 42.3601,
          	longitude: -71.0589,
          	metro_code: 532,
          };


          locate('fd4d87f605681c0959c16d9164ab6a4a', (err, response) => {

           var locations = [];

           if(response){
             result = response;
           }

           cell
             .each(function(d){
               if(d.value.hasLocation && result != null){
                 var itemB = d.value.location;
                 var distance = geolib.getDistanceSimple(result, itemB)
                 if(distance < 200000){
                   locations.push(d);
                 }
               }
             })
             ;

           if(locations.length > 1){

             locations = locations.sort(function(a,b){
               return +b.value.maxTotal - +a.value.maxTotal;
             })
             .filter(function(d){
               if( ["nj","ny","ct"].indexOf(result.region_code.toLowerCase()) > -1){
                 return d;
               }
               return d.value.companyData.State == result.region_code.toLowerCase();
             })
             locations = locations.slice(0,cutAmount)

           }
           if(locations.length != 0){

             tableData = locations;
             newsIdSelected = +locations[0].key;
             highlightedPosition = [locations[0].x,locations[0].y,locations[0].value.radius];

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
              .text(newsIDName.get(newsIdSelected).Company)
              .attr("class","swarm-axis-annotation-text")
              .attr("y",highlightedAnnotationOffset+10)
              ;

            cellCircle.each(function(d,i,j){
              if(+d.key == newsIdSelected){
                highlightedItem(d3.select(this));
              }
            })

           }
           else{
             tableData = newsNest.slice(0,cutAmount);
           }
           if(urlParam != "" && +urlParam != 0){
             currentChart = stepperSequence[urlParam];
             buildChart(currentChart);
           }

         })

      }

      for (var i = 0; i < 250; ++i) simulation.tick();

      cell = chartG
        .selectAll("g")
        .data(newsNest)
        .enter()
        .append("g")
        .attr("class","swarm-cell-g")
        ;

      cellLine = cell
        .append("path")
        .attr("class","swarm-line")
        ;


      cellCircleTwo = cell
        .append("circle")
        .attr("class","swarm-circle-two")
        .attr("r", function(d){
          return 4
        })
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) { return d.y; })
        ;

      cellCircle = cell
        .append("circle")
        .attr("class","swarm-circle")
        .attr("r", function(d){
          return d.value.radius
        })
        .attr("cx", function(d) { return d.x; })
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
          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          var value = getPercentType(cut,d.value);
          return genderColorScale(value);
        })
        .style("stroke",function(d){
          var value = getPercentType(cut,d.value);
          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          if(d.key == newsIdSelected){
            return d3.color(genderColorScale(value)).darker(highlightedCircleStrokeDarkness);
          }
          return d3.color(genderColorScale(value)).darker(1);
        })
        ;

      cellImages = cell
        .append("g")
        .attr("transform",function(d,i){
          return "translate(" + d.x + "," + d.y + ")";
        })
        .attr("class","swarm-image-container")

      cellImages
        .append("image")
        .attr("class","swarm-image")
        .attr("xlink:href",function(d){
          if(d.value.companyName == "Newsday (Long Island)"){
            return "assets/newsday-logo.svg"
          }
          if(d.value.companyName == "the new york times"){
            return "assets/ny-times-logo.svg"
          }
          if(d.value.companyName == "chicago tribune"){
            return "assets/chicago-tribune-logo.svg"
          }
          if(d.value.companyName == "the wall street journal"){
            return "assets/wsj-logo.svg"
          }
          if(d.value.companyName == "Los Angeles Times"){
            return "assets/la-times.svg"
          }
          if(d.value.companyName == "usa today"){
            return "assets/usa-today-logo.svg"
          }
          if(d.value.companyName == "the washington post"){
            return "assets/wapo-logo.png"
          }
          return null;
        })
        .attr("width",function(d){
          return d.value.radius*2*.7;
        })
        .attr("height",function(d){
          return d.value.radius*2*.7;
        })
        // .style("transform",function(d){
        //   return "translate("+(-1*d.value.radius*2*.7)/2+"px,"+(-1*d.value.radius*2*.7)/2+"px)"
        // })
        .attr("style",function(d){
          return "-webkit-transform: translate("+(-1*d.value.radius*2*.7)/2+"px,"+(-1*d.value.radius*2*.7)/2+"px); transform:translate("+(-1*d.value.radius*2*.7)/2+"px,"+(-1*d.value.radius*2*.7)/2+"px);";
        })
        ;
      function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
      }

      cellText = cell
        .append("text")
        .attr("x",function(d,i){
          return d.x;
        })
        .attr("y",function(d,i){
          return d.y;
        })
        .attr("class","swarm-text")
        .style("opacity",0)
        .attr("class","swarm-text")
        .text(function(d){
          var text = d.value.companyName.replace(/\b\w/g, l => l.toUpperCase())
          return text;
        })
        ;

      cellText.filter(function(d){
        return newDataIDs.indexOf(+d.key) == -1
      })
      .append("tspan")
      .attr("dx",2)
      .text(function(d){
        return "*"
      })
      ;

      cellDash = cell
        .append("line")
        .attr("class","swarm-text-dash")
        .style("opacity",0)
        ;

      footerContainer = container.append("div")
        .attr("class","footer-container")
        .append("div")
        .attr("class","footer-wrapper")
        ;

      var newsLabLogo = footerContainer.append("div")
        .attr("class","news-lab-logo")

      newsLabLogo.append("img").attr("src","assets/newsinit_logo.png")

      newsLabLogo
        .append("p")
        .html("*98 of 342 newsrooms are compared to a geography larger than a city, (e.g., USA Today: USA. Boston Globe: Massachusetts). Geographies were approximated using public data.")
        ;

      var embedLink = footerContainer.append("div")
        .attr("class","embed-link")

      embedLinkText = embedLink
        .append("p")
        .append("span")
        .attr("class","embed-link-text")
        .text("Embed This Chart")
        .on("click",function(d){
          d3.select(this).text("Paste code into your site")
          embedLinkInput.style("display","block")
            .attr("readonly",true)
            .attr("value",function(d){
                return "<iframe src='https://googletrends.github.io/asne2019/index.html?view="+stepperSequence.indexOf(currentChart)+"&filter="+cut+"' frameborder='0'></iframe>"
            })
            ;
        })
        ;

      embedLinkInput = embedLink.append("input");

      d3.select(".note-new-data").on("click",function(d){
        d3.select(".footer-highlight").classed("footer-highlighted",true);
        document.getElementById('footer-element').scrollIntoView();
      })

      footerContainer.append("div")
        .attr("class","swarm-chart-source")
        .attr("id","footer-element")
        .selectAll("p")
        .data(["Source: ASNE, Census: &lsquo;11-&lsquo;15","American Community Survey.","Newsrooms shown are those","with 25 total staff or more"])
        // .data(["Source: ASNE, Census: &lsquo;11-&lsquo;15","American Community Survey.","Newsrooms shown are those","with 25 total staff or more","<span class='note-new-data-footer'>*</span>About two-thirds of newsrooms did not respond to the 2018 survey and use data from 2017. This year’s respondents are here."])
        .enter()
        .append("p")
        .attr("class","swarm-chart-source-text")
        .style("margin-top",function(d,i){
          if(i==1 || i == 4){
            return "10px"
          }
          return null;
        })
        .classed("footer-highlight",function(d,i){
          if(i==4){
            return true;
          }
          return false;
        })
        .html(function(d){
          return d;
        })
        ;



      window.addEventListener('click', function(e){
        if (document.getElementById('search-results-box').contains(e.target)){
          // Clicked in box
        } else{
          chartToolTip.style("visibility",null);
          searchResultsContainer.style("display",null);
        }
      });

      window.addEventListener('touchstart', function(e){
        if (document.getElementById('search-results-box').contains(e.target)){
          // Clicked in box
        } else{
          chartToolTip.style("visibility",null);
          searchResultsContainer.style("display",null);
        }
      });

      buildToggles()
      searchSpectrum();

      buildAxis();
      buildAverage();


    }
    else if(chartType == "arrow-scatter"){
      var arrowDuration = duration;

      var switchSet = false;
      var switchNum = 0;

      if(!rebuildAxis){
        arrowDuration = 0
      }

      var rowSpacing = 15
      // cellCircle = cell.selectAll("circle")
      var chartAnnotationData;

      var cellFiltered = cell
        .filter(function(d){
          return d.value.miniChart > -1 || d.key == newsIDSearch;
        })
        .sort(function(a,b){
          if(cut=="race"){
            return b.value.raceDiff - a.value.raceDiff;
          }
          return b.value.diff - a.value.diff;
        })
        .each(function(d,i){
          d.value.arrowSort = i;

          if(d.value.diff < 0 && cut != "race"){
            if(!switchSet){
              switchSet = true;
              switchNum = i+2
            }
            d.value.arrowSort = i+2;
          }
          if(d.value.raceDiff < 0 && cut == "race"){
            if(!switchSet){
              switchSet = true;
              switchNum = i+2
            }
            d.value.arrowSort = i+2;
          }

          if(i==0){
            chartAnnotationData = d;
          }
        })

      var items = cellFiltered.size()+2;

      var delay = 500;

      cell
        .filter(function(d){
          return d.value.miniChart == -1 && d.key != newsIDSearch;
        })
        .style("opacity",0)
        ;

      cellCircle = cell.selectAll(".swarm-circle")
        .on("mouseover",function(d){
        })
        .on("mouseout",function(d){
        })

      cellCircle
        .filter(function(d){
          return d.value.miniChart > -1 || d.key == newsIDSearch;
        })
        .style("opacity",1)
        .style("fill",null)
        .style("stroke",null)
        .transition()
        .duration(arrowDuration)
        .attr("r", 4)
        .attr("cx", function(d) {
          if(cut == "race"){
            return xScale(getPercentType("race",d.value));
          }
          return xScale(getPercentType("gender",d.value));
        })
        .attr("cy", function(d,i) {
          return d.value.arrowSort*rowSpacing + rowSpacing/2
        })
        ;

      cellImages = cell.selectAll(".swarm-image-container")

      cellImages
        .filter(function(d){
          return d.value.miniChart > -1 || d.key == newsIDSearch;
        })
        .transition()
        .duration(duration)
        .style("opacity",0)
        ;

      cellText = cell.selectAll(".swarm-text")

      cellText
        .style("text-anchor",null)
        .style("fill",function(d){
          if(+d.key == newsIdSelected){
            return "black";
          }
          return null;
        })
        .style("font-weight",function(d){
          if(+d.key == newsIdSelected){
            return 600;
          }
          return null
        })
        .filter(function(d){
          return d.value.miniChart > -1 || d.key == newsIDSearch;
        })
        .style("opacity",null)
        .transition()
        .duration(arrowDuration)
        .attr("x", function(d) {
          return 0;
        })
        .attr("y", function(d,i) {
          return d.value.arrowSort*rowSpacing + rowSpacing/2
        })
        ;

      var defaultFontSize = 11;

      cellCircleTwo = cell.selectAll(".swarm-circle-two")
        .on("mouseover",function(d){
        })
        .on("mouseout",function(d){
        })

      cellCircleTwo
        .filter(function(d){
          return d.value.miniChart > -1 || d.key == newsIDSearch;
        })
        .attr("r", 4)
        .attr("cx", function(d) {
          if(cut == "race"){
            var result = getPercentType("race-old",d.value);
            if(result == "n/a"){
              return null;
            }
            return xScale(result);
          }
          var result = getPercentType("gender-old",d.value);
          if(result == "n/a"){
            return null;
          }
          return xScale(result);
        })
        .attr("cy", function(d,i,j) {
          return d.value.arrowSort*rowSpacing + rowSpacing/2
        })
        .transition()
        .duration(arrowDuration)
        .delay(function(d){
          if(!rebuildAxis){
            return 0;
          }
          return d.value.arrowSort*10+delay;
        })
        .style("opacity",1)
        ;

      cellText.filter(function(d){
          if(d.key == newsIDSearch){
            return d;
          }
          return null;
        })
        .style("fill",newsIDSearchColor)
        .style("font-weight",600)
        .transition()
        .duration(duration)
        .style("font-size","15px")
        .transition()
        .duration(duration)
        .style("font-size",defaultFontSize+"px")
        ;

      cellCircleTwo.filter(function(d){
          if(d.key == newsIDSearch){
            return d;
          }
          return null;
        })
        .transition()
        .duration(duration)
        .style("fill",newsIDSearchColor)
        .style("stroke",newsIDSearchColor)
        .transition()
        .duration(duration)
        .style("fill",null)
        .style("stroke",null)
        ;

      cellCircle.filter(function(d){
          if(d.key == newsIDSearch){
            return d;
          }
          return null;
        })
        .transition()
        .duration(duration)
        .style("fill",newsIDSearchColor)
        .style("stroke",newsIDSearchColor)
        .transition()
        .duration(duration)
        .style("fill",null)
        .style("stroke",null)
        ;

      function drawArrow (t0,t1,topOffset) {
  			var d = t1 > t0 ?
          // ("M"+t0+",0 L"+t1+",0 Z") :
          ("M"+(t1-6)+","+topOffset+" L"+(t1-12)+","+(topOffset+4)+" L"+(t1-12)+","+(topOffset+1.5)+" L"+t0+","+topOffset+" L"+(t1-12)+","+(topOffset-1.5)+" L"+(t1-12)+","+(topOffset-4)+" L"+(t1-6)+","+topOffset) :
          ("M"+(t1+6)+","+topOffset+" L"+(t1+12)+","+(topOffset+4)+" L"+(t1+12)+","+(topOffset+1.5)+" L"+t0+","+topOffset+" L"+(t1+12)+","+(topOffset-1.5)+" L"+(t1+12)+","+(topOffset-4)+" L"+(t1+6)+","+topOffset);

          // ("M0," + (t1-2) + " L4," + (t1-8) + " L1.5," + (t1-8) + " L0," + t0 + " L-1.5," + (t1-8) + " L-4," + (t1-8) + " Z") :
  				// ("M0," + (t1-2) + " L4," + (t1-8) + " L1.5," + (t1-8) + " L0," + t0 + " L-1.5," + (t1-8) + " L-4," + (t1-8) + " Z") :
  				// ("M0," + (t1+2) + " L4," + (t1+8) + " L1.5," + (t1+8) + " L0," + t0 + " L-1.5," + (t1+8) + " L-4," + (t1+8) + " Z");
  			return d;
  		}
      function drawDiamond(t0,t1){
        return ("M0," + (t1-4)
        + " L4," + (t1-8)
        // + " L1.5," + (t1-8)
        + " L0," + (t1-12)
        + " L-4," + (t1-8)
        + " Z");
      }

      cellLine = cell.selectAll(".swarm-line");

      cellLine
        .filter(function(d){
          return d.value.miniChart > -1 || d.key == newsIDSearch;
        })
        .transition()
        .duration(0)
        .attr("d",function(d){
          if(cut == "race"){
            var t0 = xScale(getPercentType("race-old",d.value))
            var t1 = xScale(getPercentType("race-old",d.value))
            if(Math.abs(d.value.raceDiff) < .02){
              return "";
            }
            if(d.value.raceDiff>.02){
              return drawArrow(xScale(getPercentType("race-old",d.value)),xScale(getPercentType("race-old",d.value)+.02),(d.value.arrowSort*rowSpacing + rowSpacing/2))
            }
            return drawArrow(xScale(getPercentType("race-old",d.value)),xScale(getPercentType("race-old",d.value)-.02),(d.value.arrowSort*rowSpacing + rowSpacing/2))
          }
          else{
            var t0 = xScale(getPercentType("gender-old",d.value))
            var t1 = xScale(getPercentType("gender-old",d.value))
            if(Math.abs(d.value.diff) < .02){
              return "";
            }
            if(d.value.diff>.02){
              return drawArrow(xScale(getPercentType("gender-old",d.value)),xScale(getPercentType("gender-old",d.value)+.02),(d.value.arrowSort*rowSpacing + rowSpacing/2))
            }
            return drawArrow(xScale(getPercentType("gender-old",d.value)),xScale(getPercentType("gender-old",d.value)-.02),(d.value.arrowSort*rowSpacing + rowSpacing/2))
          }
        })
        .attr("fill",function(d){
          if(d.value.raceDiff > 0 && cut == "race"){
            return "url(#gradient-right)";
          }
          if(d.value.diff > 0 && cut != "race"){
            return "url(#gradient-right)";
          }
          return "url(#gradient-left)";
        })
        .transition()
        .duration(arrowDuration)
        .delay(function(d){
          if(!rebuildAxis){
            return 0;
          }
          return d.value.arrowSort*10+delay+duration;
        })
        .style("opacity",1)
        .transition()
        .duration(function(){
          if(!rebuildAxis){
            return 0;
          }
          return 400
        })
        .delay(function(d,i){
          if(!rebuildAxis){
            return 0;
          }
          return d.value.arrowSort*15;
        })
        .attrTween("d",function(d){
          if(cut == "race"){
            var t0 = xScale(getPercentType("race-old",d.value))
            var t1 = xScale(getPercentType("race",d.value))
            return function(t){
              if(Math.abs(d.value.raceDiff) < .02){
                return "";
              }
              if(d.value.raceDiff>.02){
                return drawArrow(xScale(getPercentType("race-old",d.value)),(xScale(getPercentType("race",d.value))-xScale(getPercentType("race-old",d.value)+.02))*t+xScale(getPercentType("race-old",d.value)+.02),(d.value.arrowSort*rowSpacing + rowSpacing/2))
              }
              else if(d.value.raceDiff<-.02){
                return drawArrow(xScale(getPercentType("race-old",d.value)),xScale(getPercentType("race-old",d.value)-.02)-(Math.abs(xScale(getPercentType("race",d.value))-xScale(getPercentType("race-old",d.value)-.02))*t),(d.value.arrowSort*rowSpacing + rowSpacing/2))
              }
            }
          }
          else{
            var t0 = xScale(getPercentType("gender-old",d.value))
            var t1 = xScale(getPercentType("gender",d.value))
            return function(t){
              if(Math.abs(d.value.diff) < .02){
                return "";
              }
              if(d.value.diff>.02){
                return drawArrow(xScale(getPercentType("gender-old",d.value)),(xScale(getPercentType("gender",d.value))-xScale(getPercentType("gender-old",d.value)+.02))*t+xScale(getPercentType("gender-old",d.value)+.02),(d.value.arrowSort*rowSpacing + rowSpacing/2))
              }
              else if(d.value.diff<-.02){
                return drawArrow(xScale(getPercentType("gender-old",d.value)),xScale(getPercentType("gender-old",d.value)-.02)-(Math.abs(xScale(getPercentType("gender",d.value))-xScale(getPercentType("gender-old",d.value)-.02))*t),(d.value.arrowSort*rowSpacing + rowSpacing/2))
              }
            }
          }


        })
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

        var linesData = [.2,.35,.5,.65,.8];
        if(cut == "race"){
          linesData = [-1,-.25,0,.25,1];
        }

        if(viewportWidth < 820){
          var linesData = [.25,.5,.75];
          if(cut == "race"){
            linesData = [-1,0];
          }
        }

        chartAxisLines
         .append("g")
         .attr("class","swarm-arrow-x-axis-lines")
         .selectAll("line")
         .data(linesData)
         .enter()
         .append("line")
         .attr("x1",function(d){
           return xScale(d);
         })
         .attr("x2",function(d){
           return xScale(d);
         })
         .attr("y1",-10)
         .attr("y2",items*rowSpacing)
         .attr("class","swarm-axis-line")
         .style("stroke",function(d,i){
           if(d==.5){
             return "rgba(0, 0, 0, 0.09)";
           }
           return null;
         })
         .style("stroke-width",function(d,i){
           if(d==.5){
             return "2px";
           }
           return null;
         })
         ;

       chartAxisLines.append("g")
         .attr("class","swarm-scatter-y-axis-lines")
         .selectAll("line")
         .data(d3.range(items))
         .enter()
         .append("line")
         .attr("x1",function(d,i){
           if(i==0 || i==switchNum){
             return -140
           }
           return -15
         })
         .attr("x2",width+15)
         .attr("y1",function(d,i){
           return i*rowSpacing//yScale(d);
         })
         .attr("y2",function(d,i){
           return i*rowSpacing//yScale(d);
         })
         .attr("class","swarm-axis-line")
         ;

       var chartAxisText = chartAxisContainer.append("g")

       chartAxisText
         .append("g")
         .selectAll("text")
         .data(linesData)
         .enter()
         .append("text")
         .attr("x",function(d,i){
           return xScale(d);
         })
         .attr("y",function(d,i){
           return 0
         })
         .attr("class",function(d,i){
           return "swarm-arrow-tick-text";
         })
         .style("text-anchor",function(d,i){
           if(i==0){
             return "start"
           }
           if(d==1 && cut == "race"){
             return "end";
           }
           if(d==.75){
             if(viewportWidth < 651){
               return "end";
             }
           }
           if(d==.8){
             return "end";
           }
           if(viewportWidth < 820){
             if(cut == "race"){
               return "end"
             }
           }
           return null;
         })
         .text(function(d,i){
           if(i==0){
             if(cut == "race"){
               if(viewportWidth < 820){
                 return "+"+Math.floor((Math.abs(d))*100)+" pts. white"
               }
               return "More White vs. City* Census"
               return Math.floor((Math.abs(d))*100)+" pts. over-represented white"
             }
             return Math.floor((1-d)*100)+"% Male"
           }
           if(d==0){
             if(cut=="race"){
               if(viewportWidth < 820){
                 return "Parity w/Census"
               }
               return "Parity with Census"
             }
           }
           if(d<.5){
             if(cut=="race"){
               return "+"+Math.floor(Math.abs(d)*100) + " pts.";
             }
             return Math.floor((1-d)*100)+"%"
           }
           if(d==.5 && cut != "race"){
             return "50/50 Split"
           }
           if(d==.75){
             if(viewportWidth < 651){
               return Math.floor(d*100)+"% Female";
             }
           }
           if(d==.8){
             return Math.floor(d*100)+"% Female";
           }
           if(d==1 && cut == "race"){
             if(viewportWidth < 820){
               return "+"+Math.floor((Math.abs(d))*100)+" pts. more non-white vs. census"
             }
             return "More People of Color vs. City* Census"
             return Math.floor((d)*100)+" pts. over-represented people of color"
           }
           if(cut=="race"){
             return "+"+Math.floor(Math.abs(d)*100) + " pts.";
           }
           return Math.floor(d*100)+"%";
         })
         ;


      }
      function buildAverage(){

       chartDiv.select(".swarm-average").remove();
       chartDiv.select(".swarm-annnotation").remove();

       var chartAverage = chartDiv.append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
           .attr("class","swarm-average")
           ;

       var chartAnnotation = chartAverage.append("g")
        .attr("class","swarm-annnotation")
        ;

       var chartAnnotationDots = ["gender-old","gender"];
       if(cut=="race"){
         chartAnnotationDots = ["race-old","race"];
       }

       var chartAnnotationTop = chartAnnotation
          .append("g")
          .selectAll("g")
          .data(chartAnnotationDots)
          .enter()
          .append("g")
          .attr("class","swarm-arrow-annotation-top")
          .attr("transform",function(d,i){
            return "translate("+xScale(getPercentType(d,chartAnnotationData.value))+","+0+")"
          })
          .style("opacity",0)
          ;

        chartAnnotationTop
          .transition()
          .duration(arrowDuration)
          .delay(function(d,i){
            if(!rebuildAxis){
              return 0;
            }
            if(i==0){
              return delay;
            }
            return 0;
          })
          .style("opacity",1)

        var chartAnnotationText = ["Gender Diversity Improved","Gender Diversity Dropped"];
        if(cut == "race"){
          chartAnnotationText = ["Race Diversity Improved","Race Diversity Dropped"];
        }

        var chartAnnotationLeft = chartAnnotation
          .append("g")
          .selectAll("text")
          .data(chartAnnotationText)
          .enter()
          .append("text")
          .attr("class","swarm-arrow-annotation-left")
          .attr("x",0)
          .attr("y",function(d,i){
            if(i==0){
              return 0;
            }
            return rowSpacing*(switchNum);
          })
          .text(function(d){
            return d;
          })
          ;

        var chartAnnotationTopOffset = -30;

        chartAnnotationTop.append("text")
          .attr("y",chartAnnotationTopOffset)
          .attr("x",0)
          .attr("class","swarm-arrow-annotation-top-text")
          .style("fill",function(d){
            if(d=="gender"){
              return "#dab30b"
            }
            return "#888"
          })
          .style("text-anchor",function(d,i){
            if(cut=="race"){
              if(d=="race"){
                return "start"
              }
              return "end"
            }
            return null;
          })
          .text(function(d){
            if(viewportWidth < 651){
              if(d=="gender" || d=="race"){
                return "In "+yearSelected
              }
              return "In "+yearOld
            }
            if(cut=="race"){
              if(d=="race"){
                return "Race in "+yearSelected
              }
              return "Race in "+yearOld
            }
            if(d=="gender"){
              return "Gender in "+yearSelected
            }
            return "Gender in "+yearOld
          })
          ;

        chartAnnotationTop.append("line")
          .attr("y1",0)
          .attr("y2",chartAnnotationTopOffset)
          .attr("x1",0)
          .attr("x2",0)
          .attr("class","swarm-arrow-annotation-top-line")
          .style("stroke",function(d){
            if(viewportWidth < 651){
              return "black";
            }
            if(d=="gender"){
              return "#c1a427"
            }
            return "#888"
          })
          ;


      }

      buildAverage();
    }
    else if(chartType == "arrow-scatter-full"){

      var rowSpacing = 3.5;

      var chartAnnotationData;

      var annotationDataDiff = [];
      var annotationTextArray = [];

      var cellFiltered = cell
        .filter(function(d,i){
          return newsIDSearchList.indexOf(+d.key) == -1;
        })
        .sort(function(a,b){
          if(cut=="race"){
            return b.value.raceDiff - a.value.raceDiff;
          }
          else{
            return b.value.diff - a.value.diff;
          }
        })
        .each(function(d,i){

          if(cut=="race"){
            annotationDataDiff.push(d.value.raceDiff)
            annotationTextArray.push(getPercentType("race",d.value))
          }
          else{
            annotationDataDiff.push(d.value.diff)
            annotationTextArray.push(getPercentType("gender",d.value))
          }
          d.value.arrowSort = i;
        });

      var annotationDataExtent = d3.extent(annotationTextArray);

      var items = cellFiltered.size();

      var delay = duration+1000;

      cellCircle = cell.selectAll(".swarm-circle");

      cellCircle
        .transition()
        .duration(duration)
        .style("opacity",0)
        ;

      cellImages = cell.selectAll(".swarm-image-container");

      cellImages
        .transition()
        .duration(duration)
        .style("opacity",0)
        ;

      var textAmount = 15;

      cellText = cell.selectAll(".swarm-text");

      cellText
        .transition()
        .duration(0)
        .attr("x", function(d) {
          if(getPercentType("gender-old",d.value)=="n/a"){
            return 0;
          }
          if(cut=="race"){
            if(Math.abs(d.value.raceDiff) < .03){
              return xScale(getPercentType("race",d.value))+7;
            }
            if(d.value.raceDiff > 0){
              return xScale(getPercentType("race",d.value))+6;
            }
            return xScale(getPercentType("race",d.value))-6;
          }
          else{
            if(Math.abs(d.value.diff) < .02){
              return xScale(getPercentType("gender",d.value))+7;
            }
            if(d.value.diff > 0){
              return xScale(getPercentType("gender",d.value))+6;
            }
            return xScale(getPercentType("gender",d.value))-6;
          }
        })
        .style("opacity",function(d,i,j){
          if(getPercentType("gender-old",d.value)=="n/a"){
            return 0;
          }
          if(viewportWidth < 600){
            return 0;
          }
          if(cut=="race"){
            if(getPercentType("race",d.value) == annotationDataExtent[0] || getPercentType("race",d.value) == annotationDataExtent[1]){
              return 1
            }
          }
          if(getPercentType("gender",d.value) == annotationDataExtent[0] || getPercentType("gender",d.value) == annotationDataExtent[1]){
            return 1
          }
          return 0;
        })
        .style("fill",function(d){
          if(getPercentType("gender-old",d.value)=="n/a"){
            return null;
          }
          if(cut =="race"){
            if(Math.abs(d.value.raceDiff) < .03){
              return "#888"
            }
            if(d.value.raceDiff > 0){
              return "blue";
            }
            return "red";

          }
          else{
            if(Math.abs(d.value.diff) < .02){
              return "#888"
            }
            if(d.value.diff > 0){
              return "blue";
            }
            return "red";
          }
        })
        .attr("y", function(d,i) {
          if(getPercentType("gender-old",d.value)=="n/a"){
            return 0;
          }
          return d.value.arrowSort*rowSpacing
        })
        .style("text-anchor",function(d,i){
          if(getPercentType("gender-old",d.value)=="n/a"){
            return null;
          }
          if(cut == "race"){
            if(Math.abs(d.value.raceDiff) < .03){
              return "start"
            }
            if(d.value.raceDiff > 0){
              return "start"
            }
          }
          else{
            if(Math.abs(d.value.diff) < .02){
              return "start"
            }
            if(d.value.diff > 0){
              return "start"
            }
          }
          return "end";
        })
        .style("transform","none")
        ;
      //
      cellDash = cell.selectAll(".swarm-text-dash");

      cellDash
        .style("opacity",function(d,i,j){
          if(getPercentType("gender-old",d.value)=="n/a"){
            return 0;
          }
          if(cut=="race"){
            if(getPercentType("race",d.value) == annotationDataExtent[0] || getPercentType("race",d.value) == annotationDataExtent[1]){
              return 1
            }
            return 0;
          }
          else{
            if(getPercentType("gender",d.value) == annotationDataExtent[0] || getPercentType("gender",d.value) == annotationDataExtent[1]){
              return 1
            }
            return 0;
          }
        })
        .attr("y1", function(d,i) {
          return null;
          return d.value.arrowSort*rowSpacing
        })
        .attr("y2", function(d,i) {
          return null;
          return d.value.arrowSort*rowSpacing
        })
        .attr("x1", function(d) {
          return null;
          if(cut=="race"){
            if(Math.abs(d.value.raceDiff) < .03){
              return xScale(getPercentType("race",d.value))+5;
            }
            if(d.value.raceDiff > 0){
              return xScale(getPercentType("race",d.value))+4;
            }
            return xScale(getPercentType("race",d.value))-4;
          }
          else{
            if(Math.abs(d.value.diff) < .02){
              return xScale(getPercentType("gender",d.value))+5;
            }
            if(d.value.diff > 0){
              return xScale(getPercentType("gender",d.value))+4;
            }
            return xScale(getPercentType("gender",d.value))-4;
          }
        })
        .attr("x2", function(d) {
          return null;
          if(cut=="race"){
            if(Math.abs(d.value.raceDiff) < .02){
              return xScale(getPercentType("race",d.value))-2;
            }
            if(d.value.raceDiff > 0){
              return xScale(getPercentType("race",d.value))-4;
            }
            return xScale(getPercentType("race",d.value))+4;
          }
          else{
            if(Math.abs(d.value.diff) < .02){
              return xScale(getPercentType("gender",d.value))-2;
            }
            if(d.value.diff > 0){
              return xScale(getPercentType("gender",d.value))-4;
            }
            return xScale(getPercentType("gender",d.value))+4;
          }
        })

      function drawArrow (t0,t1,topOffset) {
  			var d = t1 > t0 ?
          // ("M"+t0+",0 L"+t1+",0 Z") :
          ("M"+(t1-6)+","+topOffset+" L"+(t1-12)+","+(topOffset+4)+" L"+(t1-12)+","+(topOffset+1.5)+" L"+t0+","+topOffset+" L"+(t1-12)+","+(topOffset-1.5)+" L"+(t1-12)+","+(topOffset-4)+" L"+(t1-6)+","+topOffset) :
          ("M"+(t1+6)+","+topOffset+" L"+(t1+12)+","+(topOffset+4)+" L"+(t1+12)+","+(topOffset+1.5)+" L"+t0+","+topOffset+" L"+(t1+12)+","+(topOffset-1.5)+" L"+(t1+12)+","+(topOffset-4)+" L"+(t1+6)+","+topOffset);

          // ("M0," + (t1-2) + " L4," + (t1-8) + " L1.5," + (t1-8) + " L0," + t0 + " L-1.5," + (t1-8) + " L-4," + (t1-8) + " Z") :
  				// ("M0," + (t1-2) + " L4," + (t1-8) + " L1.5," + (t1-8) + " L0," + t0 + " L-1.5," + (t1-8) + " L-4," + (t1-8) + " Z") :
  				// ("M0," + (t1+2) + " L4," + (t1+8) + " L1.5," + (t1+8) + " L0," + t0 + " L-1.5," + (t1+8) + " L-4," + (t1+8) + " Z");
  			return d;
  		}
      function drawDiamond(t0,t1,topOffset) {
        return ("M"+(t1-4)+"," + topOffset
        + " L"+(t1-8)+"," + (topOffset+4)
        // + " L1.5," + (t1-8)
        + " L"+(t1-12)+"," + (topOffset+0)
        + " L"+(t1-8)+"," + (topOffset-4)
        + " Z");
      }

      cellLine = cell.selectAll(".swarm-line")

      var keepNewsIDSearch = newsIDSearch;

      function getLineFill(d){
        if(+d.key == +keepNewsIDSearch){
          return newsIDSearchColor
        }
        if(cut == "race"){
          if(Math.abs(d.value.raceDiff) < .03){
            return "#888"
          }
          if(d.value.raceDiff > 0){
            return "url(#gradient-blue)";
          }
        }
        else{
          if(Math.abs(d.value.diff) < .02){
            return "#888"
          }
          if(d.value.diff > 0){
            return "url(#gradient-blue)";
          }
        }
        return "url(#gradient-red)";
      }

      cellLine
        .transition()
        .duration(0)
        .attr("d",function(d){
          if(getPercentType("gender-old",d.value)=="n/a"){
            return null;
          }
          if(cut=="race"){
            var resultOld = getPercentType("race-old",d.value)
            if(resultOld == "n/a"){
              return null;
            }
            var t0 = xScale(getPercentType("race-old",d.value))
            var t1 = xScale(getPercentType("race",d.value))

            if(Math.abs(d.value.raceDiff) < .03){
              return drawDiamond(t0,t1,(d.value.arrowSort*rowSpacing))
            }
            return drawArrow(t0,t1,(d.value.arrowSort*rowSpacing))
          }
          else{
            var resultOld = getPercentType("gender-old",d.value)
            if(resultOld == "n/a"){
              return null;
            }
            var t0 = xScale(resultOld)
            var t1 = xScale(getPercentType("gender",d.value))

            if(Math.abs(d.value.diff) < .02){
              return drawDiamond(t0,t1,(d.value.arrowSort*rowSpacing))
            }
            return drawArrow(t0,t1,(d.value.arrowSort*rowSpacing))
          }
        })
        .attr("fill",function(d){
          return getLineFill(d);
        })
        .style("stroke","none")
        .transition()
        .duration(750)
        .delay(function(d,i){
          if(d.key == newsIDSearch){
            return 0;
          }
          return 250+d.value.arrowSort*10;
        })
        .style("opacity",function(d,i){
          return 1;
        })
        .attr("transform",function(d){
          if(d.key == newsIDSearch){
            return "translate(0,"+(-d.value.arrowSort*rowSpacing)+")";
          }
          return null;
        })
        .transition()
        .duration(750)
        .attr("transform",function(d){
          if(d.key == newsIDSearch){
            return "translate(0,0)";
          }
          return null;
        })
        ;

      // if(rebuildAxis){
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
      // }
      function buildAxis(){
        var chartAxisContainer = chartAxis.append("g")
        var chartAxisLines = chartAxisContainer.append("g")

        var linesData = [.2,.35,.5,.65,.8];
        if(cut == "race"){
          linesData = [-1,-.25,0,.25,1];
          if(viewportWidth < 700){
            linesData = [-1,-.5,0,.35];
            if(viewportWidth < 450){
                linesData = [-.85,0,.35];
            }
          }
        }

        chartAxisLines
         .append("g")
         .attr("class","swarm-arrow-x-axis-lines")
         .selectAll("line")
         .data(linesData)
         .enter()
         .append("line")
         .attr("x1",function(d){
           return xScale(d);
         })
         .attr("x2",function(d){
           return xScale(d);
         })
         .attr("y1",-10)
         .attr("y2",items*rowSpacing)
         .attr("class","swarm-axis-line")
         .style("stroke",function(d,i){
           if(d==.5){
             return "rgba(0, 0, 0, 0.09)";
           }
           return null;
         })
         .style("stroke-width",function(d,i){
           if(d==.5){
             return "2px";
           }
           return null;
         })
         ;

       var chartAxisText = chartAxisContainer.append("g")

       chartAxisText
         .append("g")
         .selectAll("text")
         .data(linesData)
         .enter()
         .append("text")
         .attr("x",function(d,i){
           return xScale(d);
         })
         .attr("y",function(d,i){
           return 0
         })
         .attr("class",function(d,i){
           return "swarm-arrow-tick-text";
         })
         .style("text-anchor",function(d,i){
           if(i==0){
             return "start"
           }
           if(viewportWidth < 700 && cut == "race"){
             if(d==0){
               return "end"
             }
           }
           if(d==1 && cut == "race"){
             return "end";
           }
           if(d==.35 && cut == "race"){
             return "end";
           }
           if(d==.8){
             return "end";
           }
           return null;
         })
         .text(function(d,i){
           if(d==.35 && cut=="race"){
             return "+"+Math.floor(Math.abs(d)*100) + " pts. Non-white";
           }
           if(i==0){
             if(cut == "race"){
               if(viewportWidth < 700){
                 return "+"+Math.floor((Math.abs(d))*100)+" pts White"
               }
               return "More White vs. City* Census"
               return Math.floor((Math.abs(d))*100)+" pts. over-represented white"
             }
             return Math.floor((1-d)*100)+"% Male"
           }
           if(d==0){
             if(cut=="race"){
               if(viewportWidth < 750){
                 return "Parity w/census"
               }
               return "Parity with Census"
             }
           }
           if(d<.5){
             if(cut=="race"){
               return "+"+Math.floor(Math.abs(d)*100) + " pts.";
             }
             return Math.floor((1-d)*100)+"%"
           }
           if(d==.5 && cut != "race"){
             return "50/50 Split"
           }
           if(d==.8){
             return Math.floor(d*100)+"% Female";
           }
           if(d==1 && cut == "race"){
             if(viewportWidth < 700){
               return "+"+Math.floor((d)*100)+" pts Non-white"
             }
             return "More People of Color vs. City* Census"
             return Math.floor((d)*100)+" pts. over-represented people of color"
           }
           if(cut=="race"){
             return "+"+Math.floor(Math.abs(d)*100) + " pts.";
           }
           return Math.floor(d*100)+"%";
         })
         ;


      }
      function buildAverage(){

       chartDiv.select(".swarm-average").remove();
       chartDiv.select(".swarm-annnotation").remove();

       var annotationDataDiffData = [0,0];

       var chartAverage = chartDiv.append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
           .attr("class","swarm-average")
           ;

       var chartAnnotation = chartAverage.append("g")
        .attr("class","swarm-annnotation")
        ;

       var chartMouseoverBox = chartAverage.append("g")
        .attr("class","arrow-swarm-full-mouseover")
        .selectAll("rect")
        .data(cellFiltered.data())
        .enter()
        .append("rect")
        .attr("width",width)
        .attr("height",rowSpacing)
        .attr("x",function(d,i){
          return 0
        })
        .attr("y",function(d){
          return (d.value.arrowSort*rowSpacing) - rowSpacing/2;
        })
        .attr("class","arrow-swarm-full-mouseover-rect")
        .on("mouseover",function(d){

          chartAnnotationAverage.style("opacity",.5);
          chartAnnotationDiff.style("opacity",.5);

          var item = d.key;

          chartAverageText
            .style("visibility","hidden")
            ;

          cellText
            .style("opacity",function(d,i,j){
              if(getPercentType("gender-old",d.value)=="n/a"){
                return 0;
              }
              if(d.key == item){
                return 1
              }
              return 0;
            })
            .style("fill",function(d){
              if(d.key == item){
                return "black"
              }
              if(cut=="race"){
                if(Math.abs(d.value.raceDiff) < .02){
                  return "#888"
                }
                if(d.value.raceDiff > 0){
                  return "blue";
                }
              }
              else{
                if(Math.abs(d.value.diff) < .02){
                  return "#888"
                }
                if(d.value.diff > 0){
                  return "blue";
                }
              }
              return "red";
            })
            .style("font-size","14px");
            ;

          cellDash
            .style("opacity",function(d,i,j){
              if(d.key == item){
                return 1
              }
              return 0;
            })

          cellLine
            .attr("fill",function(d){
              if(d.key == item){
                return "black"
              }
              return getLineFill(d);
            })
            .style("stroke",function(d){
              if(d.key == item){
                return "black"
              }
              return "none"
            })
            ;

        })
        .on("mouseout",function(d){

          chartAnnotationAverage.style("opacity",null);
          chartAnnotationDiff.style("opacity",null);

          chartAverageText
            .style("visibility",null)
            ;

          cellDash
            .style("opacity",function(d,i,j){
              if(getPercentType("gender-old",d.value)=="n/a"){
                return 0;
              }
              if(cut=="race"){
                if(getPercentType("race",d.value) == annotationDataExtent[0] || getPercentType("race",d.value) == annotationDataExtent[1]){
                  return 1
                }
                return 0;
              }
              else{
                if(getPercentType("gender",d.value) == annotationDataExtent[0] || getPercentType("gender",d.value) == annotationDataExtent[1]){
                  return 1
                }
                return 0;
              }
            })

          cellText
            .style("opacity",function(d,i,j){
              if(getPercentType("gender-old",d.value)=="n/a"){
                return 0;
              }
              if(cut=="race"){
                if(viewportWidth < 700){
                  return 0;
                }
                if(getPercentType("race",d.value) == annotationDataExtent[0] || getPercentType("race",d.value) == annotationDataExtent[1]){
                  return 1
                }
              }
              else{
                if(getPercentType("gender",d.value) == annotationDataExtent[0] || getPercentType("gender",d.value) == annotationDataExtent[1]){
                  return 1
                }
              }
              return 0;
            })
            .style("fill",function(d){
              if(cut=="race"){
                if(Math.abs(d.value.raceDiff) < .02){
                  return "#888"
                }
                if(d.value.raceDiff > 0){
                  return "blue";
                }
              }else{
                if(Math.abs(d.value.diff) < .02){
                  return "#888"
                }
                if(d.value.diff > 0){
                  return "blue";
                }
              }
              return "red";
            })
            .style("font-size",null);
            ;

          cellLine
            .attr("fill",function(d){
              return getLineFill(d);
            })
            .style("stroke",function(d){
              return "none"
            })
            ;

        })
        ;

       chartAverage.append("g")
        .append("path")
        .attr("class","arrow-scatter-line arrow-scatter-line-average")
        .attr("d",function(d){
          var t0 = xScale(newsNestAverageT0)
          var t1 = xScale(newsNestAverageT1)

          if(Math.abs(newsNestAverageT1-newsNestAverageT0) < .02){
            return drawDiamond(t0,t1,height/2+20)
          }
          return drawArrow(t0,t1,height/2+20)
        })
        .attr("fill",function(d){
          if(newsNestAverageT1-newsNestAverageT0 > 0){
            return "url(#gradient-average)"
          }
          return "url(#gradient)";
        })
        .attr("stroke","none")
        .attr("fill-opacity",1)
        ;

       var chartAverageText = chartAverage
          .append("g")
          .attr("class","arrow-scatter-average-text")
          .attr("transform",function(d,i){
            return "translate("+xScale(newsNestAverageT1)+","+(height/2+20)+")"
          })
          .append("text")
          .attr("class","arrow-scatter-average-text-label")
          .text(function(d){
            return "Average";
          })
          ;

       for (var item in annotationDataDiff){
         if(annotationDataDiff[item]> .02){
           annotationDataDiffData[0] =  annotationDataDiffData[0]+1
         }
         else if(annotationDataDiff[item] < -.02){
           annotationDataDiffData[1] =  annotationDataDiffData[1]+1
         }
       }

       var chartAnnotationDiff = chartAnnotation
        .selectAll("text")
        .data(annotationDataDiffData)
        .enter()
        .append("text")
        .attr("class","swarm-arrow-full-annotation-diff")
        .attr("transform",function(d,i){
          if(cut=="race"){
            if(viewportWidth < 700){
              if(viewportWidth < 600){
                if(i==0){
                  return "translate("+xScale(-1)+","+(height*annotationDataDiffData[0]/items/2)+")"
                }
                return "translate("+xScale(-1)+","+height*(1-(annotationDataDiffData[1]/items/2))+")"
              }
              if(i==0){
                return "translate("+xScale(0)+","+(height*annotationDataDiffData[0]/items/2)+")"
              }
              return "translate("+xScale(0)+","+height*(1-(annotationDataDiffData[1]/items/2))+")"
            }
            if(i==0){
              return "translate("+xScale(.3)+","+(height*annotationDataDiffData[0]/items/2)+")"
            }
            return "translate("+xScale(.3)+","+height*(1-(annotationDataDiffData[1]/items/2))+")"
          }else{
            if(i==0){
              return "translate("+xScale(.51)+","+(height*annotationDataDiffData[0]/items/2)+")"
            }
            return "translate("+xScale(.51)+","+height*(1-(annotationDataDiffData[1]/items/2))+")"
          }

        })
        .style("fill",function(d,i){
          if(i==0){
            return d3.color("blue");
          }
          return d3.color("red");
        })
        .attr("x",0)
        .attr("y",0)
        .attr("dy",0)
        .selectAll("tspan")
        .data(function(d,i){
          if(cut == "race"){
            if(i==0){
              return [Math.round(d/items*100)+"%"," of newsrooms ","gained","racial diversity, "+yearOld+" - "+yearSelected];
            }
            return [Math.round(d/items*100)+"%"," of newsrooms ","lost","racial diversity, "+yearOld+" - "+yearSelected];
          }
          else{
            if(i==0){
              return [Math.round(d/items*100)+"%"," of newsrooms ","gained","gender diversity, "+yearOld+" - "+yearSelected];
            }
            return [Math.round(d/items*100)+"%"," of newsrooms ","lost","gender diversity, "+yearOld+" - "+yearSelected];
          }
        })
        .enter()
        .append("tspan")
        .attr("x",function(d,i){
          if(i==3){
            return "0";
          }
          return null;
        })
        .attr("y",0)
        .attr("dy",function(d,i){
          if(i==3){
            return "1.4em";
          }
        })
        .text(function(d){
          return d;
        })
        ;

       var chartAnnotationAverage = chartAverage
         .append("g")
         .attr("class","arrow-scatter-annoation-average")
         .attr("transform",function(d,i){
           if(cut=="race"){
             if(viewportWidth < 700){
               if(viewportWidth < 600){
                 return "translate("+xScale(-1)+","+(height/2+20)+")"
               }
               return "translate("+xScale(0)+","+(height/2+20)+")"
             }
             return "translate("+xScale(.3)+","+(height/2+20)+")"
           }
           return "translate("+xScale(.51)+","+(height/2+20)+")"
         })
         .append("text")
         .attr("class","arrow-scatter-annoation-average-text")
         .text(function(d){
           if(cut == "race"){
             return "Average: "+(Math.round((newsNestAverageT1-newsNestAverageT0)*1000)/10)+"pt. gain vs. census";
           }
           if(newsNestAverageT1-newsNestAverageT0 > 0){
             return "Average: "+(Math.round((newsNestAverageT1-newsNestAverageT0)*1000)/10)+"% increase in women";
           }
           return "Average: "+(Math.round((newsNestAverageT1-newsNestAverageT0)*1000)/10)+"% increase in men";
         })
         ;
      //
      }

      // if(rebuildAxis){
      buildAverage();
      // }
    }
    else if(chartType == "table"){

      chartDivContainerTable.selectAll(".swarm-chart-table-company-container").remove();

      cellCircle
        .on("mouseover",function(d){

        })
        .transition()
        .duration(500)
        .style("opacity",0)
        ;

      cellImages
        .transition()
        .duration(500)
        .style("opacity",0);

      if(rebuildAxis){
        chartAxis
          .select("g")
          .transition()
          .duration(500)
          .style("opacity",0)
          .on("end",function(d){
            d3.select(this).remove();
            var chartAxisContainer = chartAxis.append("g")
            buildTable();
          })
          ;
      }

      function buildTable(){

        chartTableItem = chartDivContainerTable.selectAll("div")
          .data(tableData)
          .enter()
          .append("div")
          .attr("class","swarm-chart-table-company-container")
          ;

        chartTableItem
          .transition()
          .duration(500)
          .delay(function(d,i){
            return i*100;
          })
          .style("opacity",1)
          .style("transform","translate(0px,0px)")

        chartTableItem.append("p")
          .attr("class","swarm-chart-table-company-name")
          .html(function(d){
            var oldData = newDataIDs.indexOf(+d.key);
            var textValue = "";
            if(d.value.companyName == "usa today"){
              textValue = "USA Today";
            }
            else if(d.value.companyName.length > 30){
              textValue = d.value.companyName.replace(/\b\w/g, l => l.toUpperCase()).slice(0,27)+"..."
            }
            else {
              textValue = d.value.companyName.replace(/\b\w/g, l => l.toUpperCase())
            }
            if(oldData == -1){
              textValue = textValue + "<span class='red'>*</span>"
            }
            return textValue;

            //
            // var companyName = d.value.companyName
            // if(companyName.length > 30){
            //   return companyName.replace(/\b\w/g, l => l.toUpperCase()).slice(0,27)+"..."
            // }
            // return companyName.replace(/\b\w/g, l => l.toUpperCase())
          })
          ;

        var chartTableSection = chartTableItem.selectAll("div")
          .data(function(d,i){
            var itemCount = i
            var value = d;
            return ["staff","leaders","census"].map(function(d){
              return {key:d,value:value,companyCount:itemCount}
            })
          })
          .enter()
          .append("div")
          .attr("class","swarm-chart-table-company-section")
          ;

        var chartTableRow = chartTableSection
          .selectAll("div")
          .data(function(d,i){
            var cat = d;
            var years = [yearSelected,+yearOld];
            if(cat.key == "census"){
              years = [yearSelected];
            }
            return years.map(function(d){
              return {year:d,key:cat.key,value:cat.value,companyCount:cat.companyCount}
            })
          })
          .enter()
          .append("div")
          .attr("class","swarm-chart-table-company-row")
          ;

        var chartTablePercent = chartTableRow.selectAll(".swarm-chart-table-company-percent")
          .data(function(d,i){
            var item = d;
            var newThing = ["white","black","hisp.","asian","female"].map(function(d){
              return {year:item.year,key:item.key,value:item.value,cat:d,companyCount:item.companyCount}
            })
            return newThing
          })
          .enter()
          .append("p")
          .attr("class","swarm-chart-table-company-percent")
          .text(function(d){
            if(d.key == "census"){
              if(d.cat=="female"){
                var femaleData = d.value.value.femaleCensus;
                if(femaleData == "n/a"){
                  return femaleData;
                }
                return Math.round(d.value.value.femaleCensus*100)+"%";
              }
              if(d.cat=="white"){
                return Math.round(d.value.value.whiteCensus*100)+"%";
              }
              if(d.cat == "hisp."){
                if(d.year == yearSelected){
                  return Math.round(d.value.value.hispanicCensus*100)+"%";
                }
              }
              if(d.cat == "black"){
                if(d.year == yearSelected){
                  return Math.round(d.value.value.blackCensus*100)+"%";
                }
              }
              if(d.cat == "asian"){
                if(d.year == yearSelected){
                  return Math.round(d.value.value.asianCensus*100)+"%";
                }
              }
            }
            if(d.key == "staff"){

              if(d.cat=="white"){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("white",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("white-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }
              if(d.cat=="black"){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("black",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("black-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }
              if(d.cat=="hisp."){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("hisp",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("hisp-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }
              if(d.cat=="asian"){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("asian",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("asian-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }
              if(d.cat=="female"){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("gender",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("gender-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }

            }
            if(d.key = "leaders"){

              if(d.cat=="white"){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("supWhiteRaw",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("sup-white-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }
              if(d.cat=="black"){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("supBlack",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("sup-black-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }
              if(d.cat=="hisp."){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("supHisp",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("sup-hisp-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }
              if(d.cat=="asian"){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("supAsian",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("sup-asian-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }
              if(d.cat=="female"){
                if(d.year == yearSelected){
                  return Math.round((getPercentType("supGender",(d.value.value)))*100)+"%";
                }
                else{
                  var result = getPercentType("sup-gender-old",(d.value.value));
                  if(result == "n/a"){
                    return result;
                  }
                  return Math.round((result)*100)+"%";
                }
              }

            }
            return "tbd";
          })
          ;

        chartTablePercent
          .filter(function(d,i){
            return d.key=="census" && d.year == yearSelected && i==0;
          })
          .append("span")
          .attr("class","swarm-chart-table-company-row-top-label-census")
          .text(function(d){
            if(d.value.value.companyData.hasOverride){
              if(d.value.value.companyData.override.coverage_area.length > 25){
                return d.value.value.companyData.override.coverage_area.slice(0,22)+"..."
              }
              return d.value.value.companyData.override.coverage_area;
            }
            return d.value.value.companyData.City + ", "+d.value.value.companyData.State.toUpperCase();
          })
          ;

        chartTableRow
          .filter(function(d,i){
            return d.key=="staff" && d.year == yearSelected;
          })
          .selectAll("p")
          .append("span")
          .attr("class","swarm-chart-table-company-row-top-label")
          .text(function(d){
            return d.cat;
          })
          ;

        chartTablePercent
          .filter(function(d,i){
            return i==0 && d.companyCount == 0;
          })
          .append("span")
          .attr("class","swarm-chart-table-company-row-year")
          .text(function(d){
            if(d.key == "census"){
              return "";
            }
            return d.year;
          })
          ;

        chartTablePercent
          .filter(function(d,i){
            return i==0 && d.companyCount == 0 && d.year == yearSelected;
          })
          .append("span")
          .attr("class",function(d,i){
            if(d.key == "census"){
              return "swarm-chart-table-company-row-key swarm-chart-table-company-row-census";
            }
            return "swarm-chart-table-company-row-key"
          })
          .text(function(d){
            if(d.key == "census"){
              return "audience"
            }
            if(d.key == "staff"){
              return "all"
            }
            return d.key;
          })
          .filter(function(d){
            return d.key == "census"
          })
          .append("span")
          .attr("class","swarm-chart-table-company-row-year-census-span")
          .text("Latest Census Est.")
          ;

      }

      function buildAverage(){

         chartDiv.select(".swarm-average").remove();
         chartDiv.select(".swarm-annnotation").remove();

         var chartAverage = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             ;

         var chartAnnotation = chartAverage.append("g")
          .attr("class","swarm-annnotation")
          ;

      }
      if(rebuildAxis){
        buildAverage();
      }

    }

    //clear newsIDSearch

    var previousNewsIDSearch = newsIDSearch;
    newsIDSearch = "";
    newsIDSearchList.push(previousNewsIDSearch);
  }

  // tableData = newsNest.slice(0,4);
  // table =
  buildChart("new");

  function buildToggles(){

    newToggleForRaceAndGender = stepperContainerToggle.append("div")
      .attr("class","top-row-chart-toggle-wrapper");

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

    toggleType = newToggleForRaceAndGender
      .append("div")
      .attr("class","histogram-chart-toggle-type histogram-chart-toggle-first")

    toggleType
      .selectAll("p")
      .data(raceGenderToggleData)
      .enter()
      .append("p")
      .attr("class",function(d,i){

        if(urlParamCut != ""){
          if(i==0 && d==urlParamCut){
            return "toggle-selected front-curve histogram-chart-toggle-item";
          }
          else if(i==0){
            return "front-curve histogram-chart-toggle-item";
          }

          if(i==1 && d==urlParamCut){
            return "toggle-selected back-curve histogram-chart-toggle-item";
          }
          else if(i==1){
            return "back-curve histogram-chart-toggle-item";
          }
        }
        else{
          if(i==0){
            return "toggle-selected front-curve histogram-chart-toggle-item";
          }
          if(i==1){
            return "back-curve histogram-chart-toggle-item";
          }
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
        embedLinkText.text("Embed this chart");
        embedLinkInput.style("display",null);

        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
          if(d==dataSelected){
            return true;
          }
          return false;
        })
        cut = d;
        urlParameter.set('filter', cut);

        buildChart(currentChart);
      })
      ;

    var projection = d3.geoAlbersUsa()
        // .scale(1280)
        // .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection)
        // .pointRadius(1.5)
        ;

    function mapMakeBig(){
      mapBig = true;
      searchMap.classed("swarm-chart-min",false)
      searchMapClose.style("display","block");
      searchMapLabel.style("display","none");
      searchMapScreen.style("display","none");
      mapSvg.style("pointer-events","all");
      mapSelector.style("display","block")


    }
    function mapMakeSmall(){
      mapBig = false;
      searchMap.classed("swarm-chart-min",true)
      searchMapClose.style("display",null);
      searchMapLabel.style("display",null);
      mapSvg.style("pointer-events",null);
      mapSelector.style("display",null)
      searchMapScreen.style("display",null);

    }

    searchMap = newToggleForRaceAndGender.append("div")
      .attr("class","swarm-chart-map swarm-chart-min")
      ;

    var searchMapScreen = searchMap.append("div")
      .attr("class","map-screen")
      .on("click",function(d){
        if(!mapBig){
          mapMakeBig();
        }
        else{
          mapMakeSmall();
        }
      })
      ;

    var searchMapClose = searchMap.append("div")
      .attr("class","map-close")
      .on("click",function(d){
        mapMakeSmall();
      })

    searchMapClose
      .append("div")
      .attr("class","map-close-icon")
      ;

    var searchMapLabel = searchMap.append("p")
      .attr("class","map-label")
      .text(function(d){
        return "Select Region"
      })
      ;

    var mapSvg = searchMap.append("svg")
      .attr("class","maps-chart-svg")
      .attr("viewBox","0 0 960 600")
      .append("g")
      .attr("transform","translate("+0+","+50+")")
      ;

    mapSvg.append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(stateTopo, stateTopo.objects.states).features)
      .enter().append("path")
      .attr("d", path)
      ;

    mapSvg
      .append("g")
      .append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(stateTopo, stateTopo.objects.states, function(a, b) { return a !== b; })))
      ;

    function getLocations(d){



      var itemSelected = d;

      if(!d.value.location){
        tableData = [];
        tableData.unshift(d)
        if(mobile || viewportWidth < 450){
          tableData = [d];
        }
        buildChart("table");

      } else {
        var location = d.value.location;
        var project = projection([+location.longitude,location.latitude]);

        mapSelector
          .transition()
          .duration(750)
          .attr("transform","translate("+project+")")
          ;

        var distanceArray = [];

        mapMarkers.each(function(d){
          if(d.value.hasLocation){
            var itemB = d.value.location;
            var distance = geolib.getDistanceSimple(location, itemB)
            if(distance < 200000){
              distanceArray.push(d);
            }
          }
        })

        distanceArray = distanceArray.filter(function(d){
          return +d.key != +itemSelected.key;
        });

        if(distanceArray.length > 3){
          distanceArray = distanceArray.sort(function(a,b){
            return +b.value.maxTotal - +a.value.maxTotal;
          }).slice(0,3)
        }

        tableData = distanceArray;
        tableData.unshift(d)
        if(mobile || viewportWidth < 450){
          tableData = [d];
        }
        buildChart("table");
      }


    }

    var mapMarkers = mapSvg.append("g")
      .attr("class","map-markers")
      .selectAll("circle")
      .data(searchDataSet.sort(function(a,b){
        return radiusScale(+b.value.maxTotal) - radiusScale(+a.value.maxTotal);
      }))
      .enter()
      .append("circle")
      .attr("class","map-marker")
      .attr("r",function(d){
        return radiusScale(+d.value.maxTotal);
      })
      .style("fill",function(d){
        if(d.value.hasLocation){
          return null
        }
        return "rgba(0,0,0,0)"
      })
      .attr("transform",function(d){
        if(d.value.hasLocation){
          var location = d.value.location;
          var project = projection([+location.longitude,location.latitude]);
          if(project){
            return "translate("+project+")";
          }
        }
        return null;
      })
      .on("click",function(d){
        getLocations(d);
      })
      ;

    var mapSelector = mapSvg.append("g")
      .attr("class","map-selector")
      .attr("transform","translate("+width/2+","+height*.8+")")
      ;

    var selectorRadius = 20;

    mapSelector
      .append("circle")
      .attr("class","map-selector-circle")
      .attr("r",selectorRadius)
      ;

    mapSelector
      .append("text")
      .attr("class","map-selector-target")
      .attr("transform","translate("+0+","+(-1)+")")
      .text("+")
      ;

    mapSelector
      .append("text")
      .attr("class","map-selector-text")
      .text("Show Newsrooms Here")
      .attr("transform","translate("+(0)+","+(-selectorRadius-15)+")")
      ;


    var searchDiv = toggles.append("div")
      .attr("class","swarm-chart-search-div")
      .attr("id","search-results-box")

    searchInput = searchDiv
      .append("input")
      .attr("class","swarm-chart-search")
      .attr("placeholder","Find a Newsroom")
      .on("focus",function(d){
        searchResultsContainer.style("display","block")
      })
      ;

    searchDiv
      .append("div")
      .attr("class","mag-glass")
      .append("svg")
      .attr("xmlns","http://www.w3.org/2000/svg")
      .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
      .attr("x","0px")
      .attr("y","0px")
      .attr("viewBox","0 0 100 125")
      .attr("xml:space","preserve")
      .append("path")
      .attr("d","M79.2,72.3L62.9,56.7c6.3-9.1,5.3-21.7-2.8-29.9c-9.2-9.2-24-9.2-33.2,0c-9.2,9.2-9.2,24,0,33.2c8.1,8.1,20.7,9.1,29.9,2.8  l15.6,16.4c1,1,2.6,1,3.6,0l3.4-3.4C80.3,74.9,80.2,73.3,79.2,72.3z M56,56c-6.9,6.9-18.1,6.9-25,0S24,37.9,31,31s18.1-6.9,25,0  S62.9,49.1,56,56z")
      ;

    searchResultsContainer = searchDiv
      .append("div")
      .attr("class","swarm-chart-search-results")
      ;

    var searchAlphaSort = searchResultsContainer
      .append("div")
      .attr("class","swarm-chart-search-results-alpha-container");

    searchAlphaSort.append("p")
      .text("filter")
      .attr("class","swarm-chart-search-results-alpha-label");

    searchAlphaSortLetters = searchAlphaSort
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
      .on("click",function(d){
        alphaSort = d;
        searchAlphaSortLetters.style("color",function(d){
            if(d==alphaSort){
              return "black"
            }
            return null
          })
          .style("text-decoration",function(d){
            if(d==alphaSort){
              return "underline"
            }
            return null
          })
          ;

        searchResults.style("display",function(d){
          if(d.value.chars.includes(alphaSort)){
            return "block"
          }
          return "none";
        })
      })
      ;

    function searchAddToChart(node,key){
      newsIDSearch = key;
      node.value.miniChart = -1;

      newsNest.push(node);

      cell = chartG
        .selectAll("g")
        .data(newsNest,function(d){
          return +d.key;
        })
        ;

      var cellEnter = cell
        .enter()
        .append("g")
        .attr("class","swarm-cell-g")
        ;

      cellEnter
        .append("circle")
        .attr("class","swarm-circle")
        .attr("r", function(d){
          return d.value.radius
        })
        .attr("cx", function(d) {
          return 0;
        })
        .attr("cy", function(d) { return 0; })
        .on("mouseover",function(d){
          var data = d;
          mouseOverEvents(data,d3.select(this));
        })
        .on("mouseout",function(d){
          var data = d;
          mouseOutEvents(data,d3.select(this));
        })
        .style("fill",function(d){
          return
          var value = getPercentType("gender",d.value);
          return genderColorScale(value);
          return colorScale(newsMap.get(d.NewsID).value.diff);
        })
        .style("stroke",function(d){
          var value = getPercentType("gender",d.value);
          return d3.color(genderColorScale(value)).darker(1);
        })
        .style("opacity",0)
        ;

      cellEnter
        .append("g")
        .attr("transform",function(d,i){
          return "translate(" + 0 + "," + 0 + ")";
        })
        .attr("class","swarm-image-container")
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

      cellEnter
        .append("text")
        .attr("x",function(d,i){
          return d.x;
        })
        .attr("y",function(d,i){
          return d.y;
        })
        .attr("class","swarm-text")
        .style("opacity",0)
        .attr("class","swarm-text")
        .text(function(d){
          var text = d.value.companyName.replace(/\b\w/g, l => l.toUpperCase())
          return text;
        })
        ;

      cellText.filter(function(d){
        return newDataIDs.indexOf(+d.key) == -1
      })
      .append("tspan")
      .attr("dx",2)
      .text(function(d){
        return "*"
      })
      ;

      cellEnter
        .append("line")
        .attr("class","swarm-text-dash")
        .style("opacity",0)
        ;

      cellEnter
        .append("path")
        .attr("class","swarm-line")
        ;


      cellEnter
        .append("circle")
        .attr("class","swarm-circle-two")
        .attr("r", function(d){
          return 4
        })
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) { return d.y; })
        ;

      cell = chartG.selectAll(".swarm-cell-g")

      buildChart(currentChart);

    }

    searchResults = searchResultsContainer.append("div")
      .attr("class","swarm-chart-search-results-result-container")
      .selectAll("div")
      .data(searchDataSet)
      .enter()
      .append("div")
      .attr("class","swarm-chart-search-results-result")

    searchResultText = searchResults
      .append("p")
      .attr("class","swarm-chart-search-results-result-text")
      .text(function(d){
        return d.value.companyName.replace(/\b\w/g, l => l.toUpperCase())
      })
      .on("click",function(d){
        var node = d;

        if(urlParamEmbed!=""){
          searchResultsContainer.style("display",null);
        }

        if(currentChart == "table"){
          getLocations(d);
        }
        else{
          var key = +d.key;
          var map = newsNest.map(function(d){
              return +d.key;
            }).includes(key);

          if(map){
            newsIDSearch = key;
            buildChart(currentChart);
          }
          else{
            searchAddToChart(node,key)
          }
        }
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




}

export default { init }
