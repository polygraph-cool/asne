// D3 is included by globally by default
import debounce from 'lodash.debounce'
import isMobile from './utils/is-mobile'
// import graphic from './graphic'
import loadData from './load-data'

const bodySel = d3.select('body')
let previousWidth = 0

// function resize() {
// 	const width = bodySel.node().offsetWidth
// 	if (previousWidth !== width) {
// 		previousWidth = width
// 		graphic.resize()
// 	}
// }

function init() {
	// add mobile class to body tag
	bodySel.classed('is-mobile', isMobile.any())
	// setup resize event
	// window.addEventListener('resize', debounce(resize, 150))
	loadData.init()
}

init()
