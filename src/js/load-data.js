// import * as d3 from 'd3'
import 'promis'
import graphic from './graphic'
import histogram from './histogram'
import table from './table'
import newsroom from './newsroom'

function cleanTk(d) {
	return {
		...d,
	}
}

function init() {
	return new Promise((resolve, reject) => {
		d3.queue()
			.defer(d3.csv,'assets/map_data.csv')
			.defer(d3.csv,'assets/lats.csv')
			.defer(d3.csv,'assets/cleannewsids.csv')
			.awaitAll((err, result) => {
				if (err){
					reject(err)
				}
				else {
					graphic.init(result[0],result[1],result[2]);
					histogram.init(result[0],result[1],result[2]);
					table.init(result[0],result[1],result[2]);
					newsroom.init();
				}
			})
	})
}

export default { init }
