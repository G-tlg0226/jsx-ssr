//处理children是n(n>1)维数组时产生逗号问题，将孩子进行深度转换
let parseChildren = children => children.map(child => (child instanceof Array) ? parseChildren(child) : child).join('')

//将jsx转成字符串
module.exports = function YiJsx(name, props, ...children) {
	if (typeof name == 'string') {
		//处理属性
		let propsStr = Object.keys(props || {}).map(key => ((key == 'className') ? 'class' : key) + '="' + props[key] + '"').join(' ')
		let str = '<' + name + ' ' + propsStr
		if (children.length > 0) {
			str += '>' + parseChildren(children) + '</' + name + '>'
		} else {
			str += '/>'
		}
		return str
	}
	else {
		return name(props, ...children)
	}
}