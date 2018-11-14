
/* USAGE:
locate(key, (err, result) => {
  ...
})
*/

import request from 'superagent';
import testData from './locate-test';

const debug = false;
const MAX_TIME = 4000;
let key = null;

function getIP() {
	if (debug) return Promise.resolve(testData);
	const url = 'https://api.ipify.org?format=json';
	return new Promise((resolve, reject) => {
		request.get(url).end((err, res) => {
			if (err) reject(err);
			else if (res && res.status >= 200 && res.status < 400)
				resolve(JSON.parse(res.text));
			else reject(err);
		});
	});
}

function getGeocode({ ip }) {
	if (debug) return Promise.resolve(testData);
	const url = `https://api.ipstack.com/${ip}?access_key=${key}`;
	return new Promise((resolve, reject) => {
		request.get(url).end((err, res) => {
			if (err) reject(err);
			else if (res && res.status >= 200 && res.status < 400) {
				const j = JSON.parse(res.text);
				if (j.error) reject(j.error);
				else resolve(j);
			} else reject(err);
		});
	});
}

/**
 * Get users approx. location according to IP address
 * @param {function} cb callback funtion
 */

function init(k, cb) {
	if (k) {
		key = k;
		const timeout = setTimeout(() => cb('timeout'), MAX_TIME);

		getIP()
			.then(getGeocode)
			.then(response => {
				clearTimeout(timeout);
				cb(null, response);
			})
			.catch(err => cb(err));
	} else cb('error: must pass ipstack key');
}

export default init;


// /* USAGE:
// locate((err, result) => {
//   ...
// })
// */
//
// import 'promis';
// import request from 'superagent';
//
// const test = {
// 	ip: '24.194.26.74',
// 	country_code: 'US',
// 	country_name: 'United States',
// 	region_code: 'MA',
// 	region_name: 'Massachusetts',
// 	city: 'Great Barrington',
// 	zip_code: '01230',
// 	time_zone: 'America/New_York',
// 	latitude: 42.1617,
// 	longitude: -73.3277,
// 	metro_code: 532,
// };
// const debug = false;
// const MAX_TIME = 4000;
//
// function getIP() {
// 	if (debug) return Promise.resolve(test);
// 	const url = 'https://api.ipify.org?format=json';
// 	return new Promise((resolve, reject) => {
// 		request.get(url).end((err, res) => {
// 			if (err) reject(err);
// 			else if (res && res.status >= 200 && res.status < 400)
// 				resolve(JSON.parse(res.text));
// 			else reject();
// 		});
// 	});
// }
//
// function getGeocode({ ip }) {
// 	if (debug) return Promise.resolve(test);
// 	const url = `https://freegeoip.net/json/${ip}`;
// 	return new Promise((resolve, reject) => {
// 		request.get(url).end((err, res) => {
// 			if (err) reject(err);
// 			else if (res && res.status >= 200 && res.status < 400)
// 				resolve(JSON.parse(res.text));
// 			else reject();
// 		});
// 	});
// }
//
// function init(cb) {
// 	// const p = new Promise((resolve, reject) => {
// 	const timeout = setTimeout(() => cb('timeout'), MAX_TIME);
//
// 	getIP()
// 		.then(getGeocode)
// 		.then(response => {
// 			clearTimeout(timeout);
// 			cb(null, response);
// 		})
// 		.catch(err => cb(err));
// }
//
// export default init;
