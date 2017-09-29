module.exports = function YiJsx(name, props, ...children) {
	if (typeof name == 'string') {
		//处理属性
		let propsStr = Object.keys(props || {}).map(key => ((key == 'className') ? 'class' : key) + '="' + props[key] + '"').join(' ')
		let str = '<' + name + ' ' + propsStr
		if (children.length > 0) {
			str += '>' + children.join('') + '</' + name + '>'
		} else {
			str += '/>'
		}
		return str
	}
	else {
		return name(props, ...children)
	}
}