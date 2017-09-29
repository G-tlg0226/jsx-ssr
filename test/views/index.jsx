const md5 = require('md5')

module.exports = function main(YiJsx, datas) {
	let className = "myClass"
	return (
		<div>
			<div className={className}>Hello world</div>
			<input type="text" />
			{datas.name}
		</div>
	)
}