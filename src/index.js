const fs = require('fs')
const babel = require('babel-core')
const path = require('path')
const YiJsx = require('./yi-jsx')
const md5File = require('md5-file').sync


//所有模块列表，文件绝对路径->{md5:文件md5， code:文件编译后的代码}
let modules = {}

//模板导入
function templateRequire(filePath) {
	//计算文件md5
	let md5 = md5File(filePath)
	//比对modules中的文件
	if ((modules[filePath] || {}).md5 != md5) {
		modules[filePath] = { md5, code: makeCode(filePath) }
	}
	return 'modules["' + filePath + '"].code'
}

//代码babel编译，之编译成基本代码
function codeParser(filePath) {
	let res = babel.transformFileSync(filePath, {
		"presets": [
			["es2015", { loose: true }]
		],
		plugins: ["syntax-jsx",
			["transform-react-jsx", {
				"pragma": "YiJsx"
			}]
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

//
module.exports = {
	__express(filePath, options, callback) {
		//首先读取文件内容
		// let res = babel.transformFileSync(filePath, {
		// 	"presets": [
		// 		["es2015", { loose: true }]
		// 	],
		// 	plugins: ["syntax-jsx",
		// 		["transform-react-jsx", {
		// 			"pragma": "YiJsx"
		// 		}]
		// 	]
		// })
		// //替换相对路径为针对当前文件路径
		// let code = res.code.replace(/require\(['"]([\S]+?)['"]\)/gim, (_, mPath) => {
		// 	if (mPath && mPath[0] == '.') {
		// 		mPath = path.join(path.dirname(filePath), mPath)
		// 	}
		// 	return "require('" + mPath + "')"
		// })
		let code = eval(templateRequire(filePath))
		console.log(code)
		//渲染模板
		let result = eval(code)(options)
		return callback(null, result)
	}
}