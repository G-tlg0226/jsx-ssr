const md5 = require('md5')
import test from './../req-test'

import MyComp from './comp.jsx'

module.exports = function (datas) {


	let className = "myClass"
	return (
		<div>
			<div className={className}>Hello world</div>
			<input type="text" />
			<MyComp name={test(datas.name)} />
		</div>
	)
}