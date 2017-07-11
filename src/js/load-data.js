// import * as d3 from 'd3'
import 'promis'
import graphic from './graphic'
import histogram from './histogram'
import table from './table'
import newsroom from './newsroom'
import slope from './slope'
import swarm from './swarm'
import scatter from './scatters'


function cleanTk(d) {
	return {
		...d,
	}
}

function init() {
	return new Promise((resolve, reject) => {
		d3.queue()
			.defer(d3.csv,'assets/map_data_2.csv')
			.defer(d3.csv,'assets/lats.csv')
			.defer(d3.csv,'assets/cleannewsids.csv')
			.defer(d3.csv,'assets/news_ids.csv')
			.awaitAll((err, result) => {
				if (err){
					reject(err)
				}
				else {
					scatter.init(result[0],result[1],result[2],result[3]);
					swarm.init(result[0],result[1],result[2],result[3]);
					graphic.init(result[0],result[1],result[2],result[3]);
					histogram.init(result[0],result[1],result[2],result[3]);
					table.init(result[0],result[1],result[2],result[3]);
					slope.init(result[0],result[1],result[2],result[3]);
					newsroom.init();
				}
			})
	})
}

export default { init }
