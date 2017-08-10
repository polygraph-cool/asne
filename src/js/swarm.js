
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
  var alphaSort = ""

  var miniMultipleWrapper;

  var miniTextHeight = 70;
  var miniMargin = {top: 0, right: 20, bottom: 0, left: 20};
  var miniWidth = 70-miniMargin.left - miniMargin.right;
  var miniHeight = 90 - miniMargin.top - miniMargin.bottom;
  var multipleY = d3.scaleLinear().domain([.2,.5]).range([miniHeight,0]);

  var censusMap = d3.map(censusData,function(d){ return d.city_state; });
  var searchInput;
  var newsIDSearch = "";
  var searchResults;
  var newsIDSearchColor = "#7354ab"
  var searchAlphaSortLetters;
  var searchResultsContainer;
  var yearSelected = 2014;
  var yearOld = 2001;
  var currentChart = "swarm";
  var previousChart = "swarm";
  var previousCut = "gender";
	var cut = "gender";
  var group = "all";
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
    if(kind == "gender-old"){
      kind = "gender"
      data = dataSet.yearMap.get(yearOld)
    }
    if(kind == "gender"){
      return +(data.total_num-data.male_num)/data.total_num
    }
    if(kind == "supWhite"){
      return (+data.total_sup_num - +data.white_sup_num)/data.total_sup_num;
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
  })

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

  function buildStepper(){

    var stepperContainer = chartTopSection
      .append("div")
      .attr("class","stepper-container")


    var stepperTextArray = [
      "The Newsroom Employment Diversity Survey measures the percentage of women and minorities working in newsrooms nationwide.",
      "Newsrooms are about 32 percetage points more white than the audience they report on.",
      "When measuring leadership, newsrooms with more diversity tended to also have diverse staffs.",
      "change over time"
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
        stepperPlayText.text("Resume Tour")

        var previous;

        stepperContainerToggleContainerSteps
          .each(function(d,i){
            if(d3.select(this).classed("stepper-item-selected")==true){
              previous = i;
            }
          })
          ;

        currentChart = stepperSequence[previous+1]

        stepperContainerToggleContainerSteps.classed("stepper-item-selected",function(d,i){
          if(d==currentChart && i == previous+1){
            return true;
          }
          return false;
        })
        ;

        if(previous+1==1){
          cut = "race";
        }
        else if(previous+1==0){
          cut = "gender"
        }
        buildChart(currentChart);
      })
      ;

    var stepperPlayIcon = stepperPlay.append("div")
      .attr("class","stepper-arrow")
      ;

    var stepperPlayText = stepperPlay.append("p")
      .attr("class","stepper-play-text")
      .text("Start Tour")
      ;

    var stepperContainerToggleContainer = stepperContainerToggle
      .append("div")
      .attr("class","stepper-item-container")

    var toggleText = ["Newsroom <span>by Gender</span>","Newsroom <span>by Race</span>","Staff vs. Leadership, <span>by Gender</span>","change over time"];

    var stepperContainerToggleContainerSteps = stepperContainerToggleContainer
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
      .on("mouseover",function(d,i){
        var item = i;
        stepperContainerToggleContainerHover
          .style("left",function(d,i){
            var left = item*15.89;
            return left+"px";
          })
          .style("visibility","visible")
          .html(function(){
            return toggleText[item];
          })
          ;
      })
      .on("mouseout",function(){
        stepperContainerToggleContainerHover.style("visibility",null);
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

    var stepperContainerToggleContainerHover = stepperContainerToggleContainer
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

  var xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]);
  var yScale = d3.scaleLinear().domain([0,.1]).range([height,0]);

  var chartDivContainer = container
    .append("div")
    .attr("class","swarm-chart-container")
    .style("width",width+margin.left+margin.right+"px")

  var chartTitle = chartDivContainer.append("p")
    .attr("class","chart-title")
    .html("Newsrooms, Broken-down <span>by Gender</span>")
    .style("left",margin.left+"px")
    ;

  var miniMultiple = chartDivContainer.append("div")
    .attr("class","slope-mini-multiple-div")
    ;

  var chartToolTip = chartDivContainer
    .append("div")
    .attr("class","swarm-chart-tool-tip")
    .style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    ;

  var chartToolTipCompany = chartToolTip.append("p")
    .attr("class","swarm-chart-tool-tip-company")

  var chartToolTipGenderTextContainer = chartToolTip.append("div")
    .attr("class","swarm-chart-tool-tip-row swarm-chart-tool-tip-gender-container")

  chartToolTipGenderTextContainer.append("p")
    .attr("class","swarm-chart-tool-tip-label")
    .text("Gender");

  var chartToolTipGenderText = chartToolTipGenderTextContainer.append("p")
    .attr("class","swarm-chart-tool-tip-gender")
    .text("");

  var chartToolTipRaceTextContainer = chartToolTip.append("div")
    .attr("class","swarm-chart-tool-tip-row swarm-chart-tool-tip-race-container")

  chartToolTipRaceTextContainer
    .append("div")
    .attr("class","swarm-chart-race-col")
    .selectAll("p")
    .data(["white","black","asian","hispanic"])
    .enter()
    .append("p")
    .attr("class","swarm-chart-tool-tip-label swarm-chart-tool-tip-row")
    .text(function(d){
      return d;
    })
    ;

  var chartToolTipRaceTextWrapper = chartToolTipRaceTextContainer
    .append("div")
    .attr("class","swarm-chart-race-col swarm-chart-race-col-race-text")
    ;

  var chartToolTipRaceText = chartToolTipRaceTextWrapper
    .selectAll("p")
    .data(["white","black","asian","hispanic"])
    .enter()
    .append("p")
    .attr("class","swarm-chart-tool-tip-race-text swarm-chart-tool-tip-row")
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

    var cutOutData = [];
    var searchDataSet = []

    newsNest = newsNest.filter(function(d){
      if(d.value.yearMap.has(yearSelected) && d.value.values.length > 1){
        return d;
      }
      return null;
    });

    var totalExtent = d3.extent(newsNest,function(d){
      return +d.value.yearMap.get(yearSelected).total_num;
    })

    var radiusScale = d3.scaleLinear().domain([countMin,totalExtent[1]]).range([5,30]);

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

      var first = companyData.Company.charAt(0);
      var second = "";
      if(companyData.Company.split(" ").length > 1){
        second = companyData.Company.split(" ")[1].charAt(0)
      }
      newsNest[item].value.chars = [first,second];

      var whiteCensus = .9;
      if(censusMap.has(cityState)){
        whiteCensus = +censusMap.get(cityState).white_2015/100;
      }
      else{
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
    if(newsNest[item].value.yearMap.has(yearOld) && countMini < 25){
      countMini = countMini + 1;
      newsNest[item].value.miniChart = countMini;
    }
  };

  var newsNestAverageT0 = d3.mean(newsNest,function(d){ return d.value.previousYear;});
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

    if(previousCut!=cut || previousChart!=chartType){
      previousCut = cut;
      previousChart = chartType;
      rebuildAxis = true;
    }

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

        chartToolTipCompany.text(data.value.companyName)
        if(cut=="gender"){

          chartToolTipRaceTextContainer.style("display","none");
          chartToolTipGenderTextContainer.style("display",null)

          chartToolTipGenderText
            .html(function(d){
              return Math.floor(getPercentType("gender",data.value)*100)+"% <span>Female</span>";
            })
            ;

        }
        else{
          chartToolTipRaceTextContainer.style("display",null);
          chartToolTipGenderTextContainer.style("display","none")
          chartToolTipRaceText
            .html(function(d){
              return "2%";
                // var raceValue = getPercentType("raceRaw",data.value);
                // if(raceValue < .5){
                //   return Math.floor((1-raceValue)*100)+"% White. City - "+Math.floor(data.value.whiteCensus*100)+"% White";
                // }
                // return Math.floor((raceValue)*100)+"% Non-white. City - "+Math.floor((1-data.value.whiteCensus)*100)+"% Non-white"
            })

        }


      }
      else if(chartType == "swarm-scatter"){
        element.style("stroke",function(){
          return "black";
        })
        ;
        chartToolTip
          .style("visibility","visible")
          .style("top", function(){
            if(cut=="race"){
              return yScale(getPercentType("supWhite",data.value)) + mouseoverOffsetY +"px"
            }
            return yScale(getPercentType("supGender",data.value)) + mouseoverOffsetY +"px"
          })
          .style("left",function(){
            if(cut=="race"){
              return xScale(getPercentType("raceRaw",data.value)) + data.value.radius + mouseoverOffsetX +"px"
            }
            return xScale(getPercentType("gender",data.value)) + data.value.radius + mouseoverOffsetX +"px"
          })
          .text(function(d){
            if(cut == "race"){
              return data.value.companyName+" - "+Math.floor(getPercentType("raceRaw",data.value)*100)+"%"+" - "+Math.floor(getPercentType("supWhite",data.value)*100)+"%"
            }
            return data.value.companyName+" - "+Math.floor(getPercentType("gender",data.value)*100)+"%"
          });
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
          ;
      }
    }

    function changeTitle(){
      var title = "Newsrooms, Broken Down <span>by Gender</span>";
      if(cut=="race"){
        var title = " <span>White/Non-White</span> Breakdown of Newsrooms vs. City";
      }
      if(chartType == "swarm-scatter"){
        title = "Gender Break-down of Staff vs. <span>Leaders</span>";
        if(cut == "race"){
          title = "Racial Break-down of Staff vs. <span>Leaders</span>";
        }
      }
      else if(chartType == "mini-multiple"){
        title = "<span>Change</span> in Gender Breakdown from 2002 - 2017"
      }
      else if(chartType == "arrow-scatter"){
        title = "<span>Change</span> in Gender Breakdown from 2002 - 2017"
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
        margin = {top: 40, right: 20, bottom: 40, left: 20};
        width = 800 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;
        xScale = d3.scaleLinear().domain([.2,.8]).range([0,width]).clamp(true);
        yScale = d3.scaleLinear().domain([.2,.8]).range([height,0]).clamp(true);
        if(cut == "race"){
          xScale.domain([0,.6]).range([0,width]).clamp(true);
          yScale.domain([0,.8]).range([height,0]).clamp(true);
          newsNestAverageT1 = d3.mean(newsNest,function(d){
            return getPercentType("raceRaw",d.value)
          });
          newsNestSupAverageT1 = d3.mean(newsNest,function(d){ return getPercentType("supWhite",d.value)});
        }
        else{
          newsNestAverageT1 = d3.mean(newsNest,function(d){ return d.value.currentYear;});
          newsNestSupAverageT1 = d3.mean(newsNest,function(d){ return getPercentType("supGender",d.value)});
        }
      }
      if(chartType == "mini-multiple"){
        margin = {top: 0, right: 0, bottom: 20, left: 0};
        width = 1000 - margin.left - margin.right;
        height = 2*(miniTextHeight+miniHeight+miniMargin.top+miniMargin.bottom) - margin.top - margin.bottom;
      }

      chartTitle.transition().duration(500).style("width",width+"px").style("left",margin.left+"px")

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

    changeTitle();

    if(chartType!="new"){
      setWidths(chartType);
    }

    if(chartType == "swarm-scatter"){

      cellCircle = cell.selectAll("circle")
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
          return i*10;
        })
        .attr("cx", function(d) {
          if(cut == "race"){
            return xScale(getPercentType("raceRaw",d.value));
          }
          return xScale(getPercentType("gender",d.value));
          // return diffScale(d.value.diff);
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
          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          return null;
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
        .attr("transform", function(d){
          if(cut=="race"){
            return "translate(" + xScale(getPercentType("raceRaw",d.value)) + "," + yScale(getPercentType("supWhite",d.value)) + ")"
          }
          return "translate(" + xScale(getPercentType("gender",d.value)) + "," + yScale(getPercentType("supGender",d.value)) + ")"
        })
        ;

      if(rebuildAxis){
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

      function buildAxis(){

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
            return getPercentType("raceRaw",d.value);
          }
          return getPercentType("gender",d.value);
        });
        var yValues = cellCircle.data().map(function(d){
          if(cut=="race"){
            return getPercentType("supWhite",d.value);
          }
          return getPercentType("supGender",d.value);
        });

        var chartAxisContainer = chartAxis.append("g")

        var chartAxisLines = chartAxisContainer.append("g")

        var linear = leastSquares(xValues,yValues);

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

        chartAxisLines.append("line")
          .attr("class","swarm-scatter-regression-line")
          .attr("x1", 0)
          .attr("y1", yScale(linear.intercept))
          .attr("x2", function(d){
            if(cut=="race"){
              return xScale(.6)
            }
            return xScale(.8)
          })
          .attr("y2", function(){
            if(cut=="race"){
              return yScale( (.8 * linear.slope) + linear.intercept )
            }
            return yScale( (.8 * linear.slope) + linear.intercept )
          })
          ;

        var regressionAnnotation = chartAxisLines.append("g")
          .attr("class","swarm-scatter-regression-annotation")
          .attr("transform",function(){
            if(cut=="race"){
              return "translate("+xScale(.6*.8)+","+yScale( (.8*.8 * linear.slope) + linear.intercept )+")"
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

        chartAxisLines
         .append("g")
         .attr("class","swarm-scatter-x-axis-lines")
         .selectAll("line")
         .data(function(){
           if(cut=="race"){
             return [.1,.2,.3,.4,.5]
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
            if(cut=="race"){
              return ["← More White","Staff Race","More People of Color →"]
            }
            return ["← More Male Staff","Staff Gender","More Female Staff →"]
          })
          .enter()
          .append("text")
          .attr("x",function(d,i){
            if(i==1){
              return width/2;
            }
            if(i==0){
              return width/2 - 200;
            }
            return width/2 + 200;
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
              return "end"
            }
            if(i==1){
              return "middle"
            }
            return "start"
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

         var chartAverage = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-average")
             ;

         var chartAnnotation = chartAverage.append("g")
          .attr("class","swarm-annnotation")
          ;

        chartAnnotation.append("line")
          .attr("x1",function(){
            if(cut=="race"){
              return xScale(.5);
            }
            return xScale(.65);
          })
          .attr("x2",function(){
            if(cut=="race"){
              return xScale(.55)
            }
            return xScale(.7)
          })
          .attr("y1",height-20)
          .attr("y2",height-20)
          .attr("class","swarm-annnotation-line")
          .attr("marker-end", function(d){
            return "url(#arrow-head)"
          })
          ;

        chartAnnotation.append("text")
          .style("transform",function(){
            if(cut == "race"){
              var transform = "translate("+(xScale(.5)-10)+"px,"+(height-20)+"px) rotate(0)";
              return transform;
            }
            var transform = "translate("+(xScale(.65)-10)+"px,"+(height-20)+"px) rotate(0)";
            return transform;
          })
          .attr("class","swarm-annnotation-text swarm-scatter-y-annnotation-text")
          .text(function(d){
            if(cut=="race"){
              return "People of Color Staff"
            }
            return "Women Staff";
          })
          ;

         chartAnnotation.append("line")
           .attr("x1",20)
           .attr("x2",20)
           .attr("y1",function(){
             if(cut=="race"){
               return yScale(.7);
             }
             return yScale(.75);
           })
           .attr("y2",10)
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

          console.log(newsNestAverageT1,newsNestSupAverageT1,yScale.domain(),yScale.range());

         chartAverage.append("circle")
           .attr("class","swarm-circle swarm-circle-average")
           .attr("cx",xScale(newsNestAverageT1))
           .attr("cy",function(d){
             console.log(yScale(newsNestSupAverageT1));
             return yScale(newsNestSupAverageT1);
           })
           .attr("r",6)
           ;

         chartAverage.append("text")
           .attr("class","swarm-average-text swarm-average-text-label")
           .attr("x",xScale(newsNestAverageT1))
           .attr("y",yScale(newsNestSupAverageT1) - 12)
           .style("fill","black")
           .text("Overall")

      }
      if(rebuildAxis){
        buildAverage();
      }


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

      if(rebuildAxis){
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
      }

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

      cellCircle = cell.selectAll("circle")
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
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill",function(d){
          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          var value = getPercentType(cut,d.value);
          return genderColorScale(value);
        })
        .style("stroke",function(d){
          if(+d.key == newsIDSearch){
            return newsIDSearchColor;
          }
          if(d.key == newsIdSelected){
            return highlightedStrokeColor
          }
          var value = getPercentType(cut,d.value);
          return d3.color(genderColorScale(value)).darker(1);
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

          chartAnnotation.append("line")
            .attr("x1",width-147)
            .attr("x2",width-10)
            .attr("y1",height/2+25)
            .attr("y2",height/2+25)
            .attr("class","swarm-annnotation-line")
            .attr("marker-end", function(d){
              return "url(#arrow-head)"
            })
            ;

          chartAnnotation.append("text")
            .attr("x",width-147)
            .attr("y",height/2+25)
            .attr("class","swarm-annnotation-text")
            .text(function(d){
              if(cut == "race"){
                return "More People of Color";
              }
              return "More Women";
            })
            ;


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
      if(rebuildAxis){
        buildAverage();
      }


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
          chartDiv.select(".swarm-annnotation").remove();

          var chartAnnotation = chartDiv.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr("class","swarm-annnotation")
             ;

          chartAnnotation.append("line")
            .attr("x1",width-147)
            .attr("x2",width-10)
            .attr("y1",height/2+25)
            .attr("y2",height/2+25)
            .attr("class","swarm-annnotation-line")
            .attr("marker-end", function(d){
              return "url(#arrow-head)"
            })
            ;

          chartAnnotation.append("text")
            .attr("x",width-147)
            .attr("y",height/2+25)
            .attr("class","swarm-annnotation-text")
            .text(function(d){
              if(cut == "race"){
                return "More People of Color";
              }
              return "More Women";
            })
            ;

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


      console.log(newsNest.forEach(function(d){
        console.log(d.value.companyName,+d.key,newsIdMap.get(+d.key),d);
      }));

      cell = chartG
        .selectAll("g")
        .data(newsNest)
        .enter()
        .append("g")
        .attr("class","swarm-cell-g")
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

      cellImages
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

      buildAxis();
      buildAverage();

    }
    if(chartType == "mini-multiple"){

        if(rebuildAxis){
          chartDiv.select(".swarm-average").remove();
          chartDiv.select(".swarm-annnotation").remove();

          chartAxis
            .select("g")
            .transition()
            .duration(250)
            .style("opacity",0)
            .on("end",function(d){
              d3.select(this).remove();
            })
            ;
        }

        var miniMulitpleCount = Math.floor(width/(miniWidth+miniMargin.left+miniMargin.right));

        var dataMini = newsNest.filter(function(d){
          return d.value.miniChart > -1;
        });

        function getMiniX(data,count){
          return (count%miniMulitpleCount*(miniWidth+miniMargin.left+miniMargin.right))
        }
        function getMiniY(data,count){
          return Math.floor(count/miniMulitpleCount)*(miniTextHeight+miniHeight+miniMargin.top+miniMargin.bottom)
        }

        miniMultipleWrapper = miniMultiple
          .append("div")
          .attr("class","mini-multiple-div-container")
          .selectAll("div")
          .data(dataMini)
          .enter()
          .append("div")
          .attr("class","mini-multiple-div")
          .style("transform",function(d,i){
            return "translate("+getMiniX(d,d.value.miniChart)+"px,"+ getMiniY(d,d.value.miniChart) +"px)"
          })
          ;
        //
        //
        //
        miniMultipleWrapper
          .append("div")
          .attr("class","mini-multiple-text-container")
          .append("p")
          .attr("class","mini-multiple-text")
          .style("margin-top",20)
          .text(function(d){
            var company = newsIDName.get(d.value.values[0].NewsID).Company.replace("the","");
            if(company.length > 20){
              return company.slice(0,17)+"..."
            }
            return company;
          })
          ;

        var miniMultipleWrapperSvg = miniMultipleWrapper
          .append("svg")
          .attr("class","slope-mini-svg")
          .attr("width",miniWidth+miniMargin.left+miniMargin.right)
          .attr("height",miniHeight+miniMargin.top + miniMargin.bottom)

        var miniMultipleWrapperG = miniMultipleWrapperSvg
          .append("g")
          .style("transform", "translate(" + miniMargin.left+"px" + "," + miniMargin.top+"px" + ")")
          ;

        var miniMultipleWrapperAxis = miniMultipleWrapperG
          .append("g")
          .attr("class","slope-line-axis-container")

        miniMultipleWrapperG
          .append("circle")
          .attr("cx",function(d){
            return 0;
          })
          .attr("cy",function(d){
            return multipleY(getPercentType("gender-old",d.value));
          })
          .attr("r",3)
          .attr("class","slope-small-dot")
          .style("fill",function(d){
            if(d.value.diff > 0){
              return "blue"
            }
            return "red"
          })
          ;

        miniMultipleWrapperG
          .append("text")
          .attr("x",function(d){
            return 0;
          })
          .attr("y",function(d,i){
            if(i==0){
              return multipleY(getPercentType("gender-old",d.value))+27;
            }
            return multipleY(getPercentType("gender-old",d.value))+15;
          })
          .attr("class","slope-small-text")
          .text(function(d,i){
            if(i==0){
              return Math.floor(100*getPercentType("gender-old",d.value))+"%";
            }
            return Math.floor(100*getPercentType("gender-old",d.value));
          })
          ;
        //
        miniMultipleWrapperG
          .append("text")
          .attr("x",function(d){
            return 0;
          })
          .attr("y",function(d,i){
            if(i==0){
              return multipleY(getPercentType("gender-old",d.value))+15;
            }
            return null;
          })
          .attr("class","slope-small-text slope-small-text-bold")
          .text(function(d,i){
            if(i==0){
              return yearOld;
            }
            return null;
          })
          ;
        //
        miniMultipleWrapperG
          .append("text")
          .attr("x",function(d){
            return miniWidth;
          })
          .attr("y",function(d,i){
            if(i==0){
              return multipleY(getPercentType("gender",d.value))+15;
            }
            return null
          })
          .attr("class","slope-small-text slope-small-text-bold")
          .text(function(d,i){
            if(i==0){
              return "2016";
            }
            return null;
          })
          .style("text-anchor",function(d,i){
            if(i==0){
              return "start";
            }
            return null;
          })
          ;
        //
        miniMultipleWrapperG
          .append("text")
          .attr("x",function(d){
            return miniWidth;
          })
          .attr("y",function(d,i){
            if(i==0){
              return multipleY(getPercentType("gender",d.value))+27;
            }
            return multipleY(getPercentType("gender",d.value))+15;
          })
          .attr("class","slope-small-text")
          .text(function(d,i){
            if(i==0){
              return Math.floor(100*getPercentType("gender",d.value))+"%";
            }
            return Math.floor(100*getPercentType("gender",d.value));
          })
          .style("text-anchor",function(d,i){
            if(i==0){
              return "start";
            }
            return null;
          })
          ;

        miniMultipleWrapperG
          .append("circle")
          .attr("cx",function(d){
            return miniWidth;
          })
          .attr("cy",function(d){
            return multipleY(getPercentType("gender",d.value));
          })
          .attr("r",3)
          .attr("class","slope-small-dot")
          .style("fill",function(d){
            if(d.value.diff > 0){
              return "blue"
            }
            return "red"
            // return genderColorScale(getPercentType("gender",d.value.values[0]))
          })
          ;

        cellCircle
          .each(function(d){
            d.value.currentCx = d3.select(this).attr("cx");
          })
          .style("opacity", function(d) {
            if(d.value.miniChart > -1){
              return null
            }
            return 0;
          })
          .transition()
          .duration(duration)
          .delay(function(d,i){
            return i*10;
          })
          .attr("cx", function(d) {
            if(d.value.miniChart > -1){
              return getMiniX(d,d.value.miniChart) + miniMargin.left + miniWidth;
            }
            return d.value.currentCx;
          })
          .style("fill",function(d){
            if(d.value.diff > 0){
              return "blue"
            }
            return "red"
            // return genderColorScale(getPercentType("gender",d.value.values[0]))
          })
          .style("stroke",function(d){
            if(d.value.diff > 0){
              return "blue"
            }
            return "red"
          })
          .attr("r",3)
          .attr("cy", function(d) {
            return multipleY(getPercentType("gender",d.value))+miniTextHeight+miniMargin.top + getMiniY(d,d.value.miniChart);
          })
            // if(cut == "race"){
            //   return yScale(getPercentType("supWhite",d.value));
            // }
            // return yScale(getPercentType("supGender",d.value));
        cellImages.style("opacity",0)

        miniMultipleWrapperG
          .append("line")
          .attr("class","slope-line")
          .attr("y1", function(d) {
            return multipleY(getPercentType("gender-old",d.value));
          })
          .attr("x1", function(d) {
            return 0;
          })
          .attr("y2", function(d) {
            return multipleY(getPercentType("gender",d.value));
          })
          .attr("x2", function(d) {
            return miniWidth;
          })
          .attr("stroke-linecap","round")
          .attr("stroke-linejoin","round")
          .attr("stroke-width",1.8)
          .style("stroke",function(d){
            if(d.value.diff > 0){
              return "blue"
            }
            return "red"
            // return genderColorScale(getPercentType("gender",d.value.values[0]))
          })
          ;
        //
        miniMultipleWrapperAxis
          .selectAll("line")
          .data([.2,.3,.4,.5])
          .enter()
          .append("line")
          .attr("class","slope-line-axis")
          .attr("y1", function(d,i) {
            return multipleY(d)
            // return i*20+"%";
          })
          .attr("x1", function(d) {
            return 0;
          })
          .attr("y2", function(d,i) {
            return multipleY(d)
          })
          .attr("x2", function(d) {
            return miniWidth;
          })
          .style("stroke",function(d){
            if(d==.5){
              return "black";
            }
          })

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
      .attr("id","search-results-box")

    searchInput = searchDiv
      .append("input")
      .attr("class","swarm-chart-search")
      .attr("placeholder","Find a Newsroom")
      .on("focus",function(d){
        searchResultsContainer.style("display","block")
      })
      ;

    searchResultsContainer = searchDiv
      .append("div")
      .attr("class","swarm-chart-search-results");

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

    console.log(searchDataSet);

    searchResults = searchResultsContainer.append("div")
      .attr("class","swarm-chart-search-results-result-container")
      .selectAll("div")
      .data(searchDataSet)
      .enter()
      .append("div")
      .attr("class","swarm-chart-search-results-result")
      .append("p")
      .attr("class","swarm-chart-search-results-result-text")
      .text(function(d){
        return d.value.companyName;
      })
      .on("click",function(d){
        var node = d;
        var key = +d.key;
        var map = newsNest.map(function(d){
            return +d.key;
          }).includes(key);
        console.log(map);
        if(map){
          newsIDSearch = key;
          buildChart(currentChart);
        }

        else{
          newsIDSearch = key;
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
          cell = chartG.selectAll(".swarm-cell-g")


          buildChart(currentChart);

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
  buildToggles()
  searchSpectrum();
  window.addEventListener('click', function(e){
    if (document.getElementById('search-results-box').contains(e.target)){
      // Clicked in box
    } else{
      searchResultsContainer.style("display",null);
    }
  });
}

export default { init }
