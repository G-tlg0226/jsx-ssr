const fs = require('fs')
const babel = require('babel-core')
const path = require('path')
const YiJsx = require('./yi-jsx')

module.exports = {
	__express(filePath, options, callback) {
		//首先读取文件内容
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
		//去掉‘use strict’
		let code = res.code.replace(/'use strict';?/gim, '');
		//路径替换暂时不处理
		//替换相对路径为针对当前文件路径
		// let code1 = code.replace(/require\(['"]([\S]+?)['"]\)/gim, (_, mPath) => {
		// 	if (mPath && mPath[0] == '.') {
		// 		path.relative()
		// 	}
		// 	return "require('" + mPath + "')"
		// })
		console.log(code)
		//渲染模板
		let result = eval(res.code)(YiJsx, options)
		return callback(null, result)
	}
}