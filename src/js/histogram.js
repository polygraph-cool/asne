// D3 is included by globally by default
// import * as d3 from 'd3'
// import loadData from './load-data'

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
  var countMin =  50;

	function getAverage(data){
		if(cut == "gender"){
			return d3.mean(data,function(d){return +d.male_num/d.total_num});
		}
		if(cut == "supWhite"){
			return d3.mean(data,function(d){return +d.white_sup_num/d.total_sup_num});
		}
		if(cut == "supGender"){
			return d3.mean(data,function(d){return +d.male_sup_num/d.total_sup_num});
		}
		return d3.mean(data,function(d){return +d.white_num/d.total_num});
	}

	function getPercent(data){
		if(cut == "gender"){
			return +data.male_num/data.total_num
		}
		if(cut == "supWhite"){
			return +data.white_sup_num/data.total_sup_num;
		}
		if(cut == "supGender"){
			return +data.male_sup_num/data.total_sup_num;
		}
		return +data.white_num/data.total_num
	}

	var latLongMap = d3.map(latLongData,function(d){ return d.NewsID});
	var newsIdMap = d3.map(newsIDLocation,function(d){ return d.NewsID});
  var newsIDName = d3.map(newsIDInfo,function(d){ return d.NewsID});
	var regionMap = d3.map(states,function(d){
		return d[1];
	})

	var width = 1000;
	var horzScale = d3.scaleLinear().domain([0,1]).range([0,width])
	var container = d3.select(".histogram");

  var toggles = container.append("div")
    .attr("class","histogram-chart-toggle-wrapper");

  toggles
    .append("div")
    .attr("class","histogram-chart-toggle-size")
    .selectAll("p")
    .data([0,20,50,100,500])
    .enter()
    .append("p")
    .attr("class","histogram-chart-toggle-item")
    .text(function(d){
      return d;
    })
    .on("click",function(d){
      countMin = d;
      buildChart();
    })
    ;

  toggles
    .append("div")
    .attr("class","histogram-chart-toggle-type")
    .selectAll("p")
    .data(["race","gender","supWhite","supGender"])
    .enter()
    .append("p")
    .attr("class","histogram-chart-toggle-item")
    .text(function(d){
      return d;
    })
    .on("click",function(d){
      cut = d;
      buildChart();
    })
    ;



  function buildChart(){

    var filteredMapData = mapData.filter(function(d){
      if(cut == "supWhite" || cut == "supGender"){
        return d.total_num > countMin && d.total_sup_num > 0;
      }
      return d.total_num > countMin;
    })
    ;

    d3.selectAll(".histogram-chart-wrapper").remove();

    var chartDiv = container.append("div")
      .attr("class","histogram-chart-wrapper")
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

    var dataToMap = yearNest.filter(function(d){
        return d.key == 2014
      })[0].value;

    dataToMap.values = d3.nest()
      .key(function(d){
        return Math.round(getPercent(d)*50)/50;
      })
      .sortKeys(function(a,b){
        return a-b;
      })
      // .rollup(function(leaves){
      //   var average = getAverage(leaves);
      //   return {average:average,values:leaves};
      // })
      .entries(dataToMap.values)
      ;

    chartDiv.append("div")
      .attr("class","histogram-avg-div")
      .style("left",function(d){
        return (dataToMap.average*width+1)+"px"
      })
      .append("p")
      .text(Math.round(dataToMap.average*100)+"%")
      ;



    var yearsColumn = chartDiv
      .selectAll(".histogram-year-container")
      .data(dataToMap.values)
      .enter()
      .append("div")
      .attr("class","histogram-year-container")
      .style("left",function(d){
        return (d.key*width+1)+"px"
      })
      ;
    //
    yearsColumn
      .selectAll("div")
      .data(function(d){
        return d.values
      })
      .enter()
      .append("div")
      .attr("class",function(d){
        var state = null;
        var region = null;
        if(newsIdMap.has(d.NewsID)){
          state = newsIdMap.get(d.NewsID).State;
        }
        if(regionMap.has(state)){
          region = regionMap.get(state)[3];
        }

        if(region =="West"){
          region = "green"
        }
        if(region =="South"){
          region = "blue"
        }
        if(region =="Midwest"){
          region = "purple"
        }
        if(region =="Northeast"){
          region = "yellow"
        }
        return "histogram-year-item "+region
      })
      .style("background-color",function(d){
        // return backgroundFunction(d)
        return null
      })
      .on("mouseover",function(d){
        console.log(newsIDName.get(d.NewsID).Company);
      })
      ;

    yearsColumn.append("p")
      .text(function(d,i){
        if(i%5 == 0 || i==0 || i==yearsColumn.size()-1){
          return Math.round(d.key*100)+"%";
        }
        return null;

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
