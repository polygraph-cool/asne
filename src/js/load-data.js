// import * as d3 from 'd3'
import 'promis'
import graphic from './graphic'
import histogram from './histogram'
import table from './table'
// import newsroom from './newsroom'
import slope from './slope'
import swarm from './swarm'
import scatter from './scatters'
import arrowScatter from './arrow-scatter'
import maps from './maps'


function cleanTk(d) {
	return {
		...d,
	}
}

function init() {
	return new Promise((resolve, reject) => {
		d3.queue()
			.defer(d3.csv,'assets/map_data_3.csv')
			.defer(d3.csv,'assets/lats.csv')
			.defer(d3.csv,'assets/cleannewsids.csv')
			.defer(d3.csv,'assets/news_ids.csv')
			.defer(d3.json,'assets/usJson.json')
			.awaitAll((err, result) => {
				if (err){
					reject(err)
				}
				else {
					maps.init(result[0],result[1],result[2],result[3],result[4]);
					arrowScatter.init(result[0],result[1],result[2],result[3]);
					scatter.init(result[0],result[1],result[2],result[3]);
					swarm.init(result[0],result[1],result[2],result[3]);
					graphic.init(result[0],result[1],result[2],result[3]);
					histogram.init(result[0],result[1],result[2],result[3]);
					table.init(result[0],result[1],result[2],result[3]);
					slope.init(result[0],result[1],result[2],result[3]);
					// newsroom.init();
				}
			})
	})
}

export default { init }
