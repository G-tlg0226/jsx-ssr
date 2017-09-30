//处理children是n(n>1)维数组时产生逗号问题，将孩子进行深度转换
const parseChildren = children => children.map(child => (child instanceof Array) ? parseChildren(child) : child).join('')

//需要加px的css属性
const pxDict = [
	"border-bottom-width", "border-left-width", "border-right-width", "border-top-width", "border-width", "outline-width",
	"border-bottom-left-radius", "border-bottom-right-radius", "border-image-width", "border-radius", "border-top-left-radius",
	"border-top-right-radius", "height", "max-height", "max-width", "min-height", "min-width", "width", "font-size", "margin",
	"margin-bottom", "margin-left", "margin-right", "margin-top", "column-rule-width", "column-width", "padding", "padding-bottom",
	"padding-left", "padding-right", "padding-top", "bottom", "left", "right", "top", "border-spacing", "letter-spacing", "line-height",
	"word-spacing"
].map(str => str.replace(/\-([a-z])/g, (_, ch) => ch.toUpperCase()))


//转换样式为字符串
const parseStyle = style => Object.keys(style).map(key => {
	let _key = key.replace(/[A-Z]/gm, s => '-' + s.toLowerCase(s))
	//有可能需要自动加上px
	return _key + ':' + ((typeof style[key] == 'number' && pxDict.indexOf(key) >= 0) ? (style[key] + 'px') : style[key])
}).join(';')

//将jsx转成字符串
module.exports = function YiJsx(name, props, ...children) {
	//对于html原有标记需要进行标签的渲染
	if (typeof name == 'string') {
		//处理属性
		let propsStr = Object.keys(props || {}).map(key => {
			let _key = key == 'className' ? 'class' : key;
			return _key + '="' + (() => (key == 'style' && typeof props[key] != 'string') ? parseStyle(props[key]) : props[key])() + '"'
		}).join(' ')
		//生成标签
		let str = '<' + name + (propsStr ? (' ' + propsStr) : '')
		if (children.length > 0) {
			str += '>' + parseChildren(children) + '</' + name + '>'
		} else {
			str += ' />'
		}
		//返回结果
		return str
	}
	//对于控件，直接调用该函数生成HTML
	else {
		return name(props, ...children)
	}
}