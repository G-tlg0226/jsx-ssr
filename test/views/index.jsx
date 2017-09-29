const md5 = require('md5')


let MyComp = (props) => <div>My Name is {props.name}</div>

module.exports = function main(YiJsx, datas) {
	let className = "myClass"
	return (
		<div>
			<div className={className}>Hello world</div>
			<input type="text" />
			<MyComp name={datas.name}/>
		</div>
	)
}