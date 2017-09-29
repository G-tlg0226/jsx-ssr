const fs = require('fs')
const babel = require('babel-core')
const path = require('path')
const YiJsx = require('./yi-jsx')
const md5File = require('md5-file').sync

let developed = false


//所有模块列表，文件绝对路径->文件编译后的代码
let modules = {}

//模板导入 - 实际应用
function templateRequireProduct(filePath) {
	//比对modules中的文件
	if (!modules[filePath]) {
		modules[filePath] = makeCode(filePath)
	}
	return 'modules["' + filePath + '"]'
}

//模板调入 - 开发模式
function templateRequireDevelop(filePath) {
	modules[filePath] = makeCode(filePath)
	return 'modules["' + filePath + '"]'
}

//模板导入 - 自动
function templateRequire(filePath) {
	return developed ? templateRequireDevelop(filePath) : templateRequireProduct(filePath)
}

//代码babel编译，之编译成基本代码
function codeParser(filePath) {
	let res = babel.transformFileSync(filePath, {
		babelrc: false,
		presets: [
			[require("babel-preset-es2015")]
		],
		plugins: [
			require("babel-plugin-syntax-jsx"),
			[require("babel-plugin-transform-react-jsx"), { "pragma": "YiJsx" }]
		]
	})
	return res.code
}

//路径处理
function pathParser(filePath, code) {
	return code.replace(/require\(['"]([\S]+?)['"]\)/gim, (_, mPath) => {
		if (mPath && mPath[0] == '.') {
			//处理模板
			if (/\.jsx$/.test(mPath))
				return 'eval(' + templateRequire(path.join(path.dirname(filePath), mPath)) + ')'
			//其他引用
			mPath = path.join(path.dirname(filePath), mPath)
		}
		return "require('" + mPath + "')"
	})
}

//编译一个文件并完成所有依赖
function makeCode(filePath) {
	let code = codeParser(filePath)
	return pathParser(filePath, code)
}

//导出引擎
module.exports = {
	__express(filePath, options, callback) {
		developed = (options.settings.env == 'development')
		let code = eval(templateRequire(filePath))
		//渲染模板
		let result = eval(code)(options)
		return callback(null, result)
	}
}