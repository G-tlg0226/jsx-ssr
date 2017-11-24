// import { program } from '../../../../Library/Caches/typescript/2.6/node_modules/@types/babel-types';

/**
 * 这个文件提供了模板引擎必须的东西，包括：
 * 1、模板的编译
 * 2、编译后代码的运行
 * 3、编译后代码缓存的处理
 * 此模板引擎的缓存机制是内存存储机制，以提升HTML的生成速度
 * 此模板引擎提供在两种模式(开发模式，产品模式)下使用，二者具有这样的区别：
 * 1、开发模式速度慢，产品模式速度快（速度提升巨大）
 * 2、开发模式下模板代码变化后刷新页面会产生变化，产品模式下模板代码变更刷新页面不会有变化（除非该模板尚未加载过）
 */

//系统库
const fs = require('fs')
const path = require('path')
//babel编译
const babel = require('babel-core')
//md5处理
const md5 = require('md5')

//必须导入，就算当前文件没有用到，因为模板引擎编译后会产生YiJsx(xxx,xxx)的格式，因此必须必须必须导入
const YiJsx = require('./yi-jsx')

//导出引擎
module.exports = function (env = 'development') {

	//检测是否在开发模式下
	const development = (env == 'development')
	//存储一下执行好了的代码（开发模式下无效）
	const programs = {}		//文件路径md5=>jsx函数 

	//模板导入
	const templateRequire = (filePath, md5Name) => programs[md5Name] = eval(makeCode(filePath))

	//代码babel编译，之编译成基本代码
	const codeParser = filePath => babel.transformFileSync(filePath, {
		//不使用babelrc
		babelrc: false,
		//预设置
		presets: [
			[require("babel-preset-es2015")]			//使用的是es2015语法
		],
		//组件
		plugins: [
			require("babel-plugin-syntax-jsx"),										//添加jsx语法支持
			[require("babel-plugin-transform-react-jsx"), { "pragma": "YiJsx" }]	//将jsx进行转换处理
		]
	}).code
	//require路径处理
	const pathParser = (filePath, code) => code.replace(/require\(['"]([\S]+?)['"]\)/gim, (_, mPath) => {
		//需要检查是不是相对路径，相对路径需要进行特殊处理
		if (mPath && mPath[0] == '.') {
			//检查是不是模板，模板需要进行特殊处理
			if (/\.jsx$/.test(mPath)) {
				//计算模板的绝对路径
				let templatePath = path.join(path.dirname(filePath), mPath)
				//对路径进行md5处理
				let md5TempName = md5(templatePath)
				//处理开发模式和成品模式
				development ? templateRequire(templatePath, md5TempName) : (programs[md5TempName] || templateRequire(templatePath, md5TempName))
				//将require('xxx')改成programs['xxxx']
				return "programs['" + md5TempName + "']"
			}
			//将相对路径转换成绝对路径
			mPath = path.join(path.dirname(filePath), mPath)
		}
		//不是模板保持require原样输出，只是内容可能做改变
		return "require('" + mPath + "')"
	})

	//编译一个文件并完成所有依赖
	const makeCode = filePath => pathParser(filePath, codeParser(filePath))

	//返回一	个函数供express调用
	return function (filePath, options, callback) {
		//  
		//对路径进行md5加密
		let md5Name = md5(filePath)
		//开发模式下每次都需要编译，产品模式下只编译一次
		development ? templateRequire(filePath, md5Name) : (programs[md5Name] || templateRequire(filePath, md5Name))
		//取出编译好的函数
		let func = programs[md5Name] || (() => '')
		//渲染引擎
		return callback(null, func(options))
	}
}