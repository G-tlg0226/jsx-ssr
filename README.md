## YIZHI-JSX express 模板引擎

## 了解一下

yizhi-jsx 模板引擎使用jsx语法进行express模板的渲染，
得力于强大的jsx语法支持以及es6语法支持，使用yizhi-jsx模板引擎能够通过jsx语法进行HTML的生成。

yizhi-jsx 模板引擎是一个轻量级的模板引擎，整个引擎的主要代码不到200行，
通过内存缓存，能够实现高速渲染。

## 开始使用

首先你需要创建一个express项目，然后将yizhi-jsx模板引擎加载到express中即可，
相关express模板引擎的内容参考官网[在express中使用模板引擎](http://www.expressjs.com.cn/guide/using-template-engines.html)，
下面是一个简单例子
```js
const express = require('express')
const path = require('path')
let app = express()
let yizhiJsx = require('yizhi-jsx')

app.set('views', path.join(__dirname, './views'))
app.engine('.jsx', yizhiJsx('development'))
app.set('view engine', 'jsx')

app.get('/', (req, res, next) => {
	res.render('index', {
		users: [
			{ id: 1, name: '王小明', age: 20, gender: '男' },
			{ id: 2, name: '李小花', age: 22 },
			{ id: 3, name: '韩梅梅', age: 25, gender: '女' },
			{ id: 4, name: '张敏敏', age: 18, gender: '女' },
			{ id: 5, name: '吴自有', age: 23, gender: '男' }
		]
	})
})

app.listen(3000)
```
接下来你可以在项目中建立views目录，并在views目录下建立index.jsx文件
（<font color="red">模板文件的后缀名必须是jsx</font>），文件内容示例如下：
```jsx
//渲染body，这是一个组件，组件名称首字母必须是大写，否则将会解析成普通html标签
let PageBody = (props) => {
	let { users, theme } = props
	return (
		<body>
			<div>
				<div className="title">用户列表</div>
				<table className={(theme == "dark") ? 'tbl-dark' : 'tbl-light'}>
					<tr>
						<th>ID</th>
						<th>姓名</th>
						<th>年龄</th>
						<th>性别</th>
					</tr>
					{users.map(user => <tr>
						<td>{user.id}</td>
						<td>{user.name}</td>
						<td>{user.age}</td>
						<td>{user.gender || '未知'}</td>
					</tr>)}
				</table>
			</div>
		</body>
	)
}

//默认导出的函数将作为入口函数
module.exports = function (data) {
	//“+”后面的内容其实最终也是一个字符串，因此，在字符串和组件直接进行拼接是没任何问题的
	return "<!doctype html>" + (
		<html>
			<head>
				<meta charset="UTF-8" />
				<title>用户列表</title>
			</head>
			{/*这里渲染了页面的body*/}
			<PageBody users={data.users} theme="dark" />
		</html>
	)
}
```
上面是一个demo，使用的是jsx语法，如果你没用过jsx，
你可以看看[React教程](http://www.runoob.com/react/react-jsx.html)，
当然，这里的jsx和react还是有相当大的差别的，
因为react是浏览器渲染，而yizhi-jsx是服务器渲染，
二者有着本质的区别。

## 模板的导入

模板的引入和普通js的引入的用法是一样的，唯一的区别就是，
模板引入必须加上后缀“.jsx”来标识模板，下面的用法都是合法的，
更多的就不做介绍了，请自行 Google es6 教程。
```js
//使用require
let MyTable = require('./comp/table.jsx')
//使用es6的import
import MyTable from './comp/table.jsx'
//引入多个
import MyTable,{Tr, Td} from './comp/table.jsx'
```
举几个错误的例子
```js
//不能直接这样使用，需要加后缀.jsx
let MyTable = require('./comp/table')
//这样的导入虽然没有错误，但是是无效的
require('./comp/table.jsx')
```

## 模板的导出
模板的导出和js的导出完全一致，就不多说了，举几个简单例子：
```js
//定义一个简单的组件，当然，这个组件和div没任何区别
let MyComp = (props, ...children) => <div {...props}>{children}</div>
//下面的几种导出方式可以任选一种
//默认导出
export default MyComp
module.exports = MyComp
//可以导出为对象
export {
	MyComp,
	//其他要导出的变量、函数、类等等
}
module.exports.MyComp = MyComp
exports.MyComp = MyComp
```

## 其他

如果有其他问题，可以伊妹儿我[lujiankang@outlook.com](mailto:lujiankang@outlook.com)

另外，本来想用英文写的，但是英语水平太菜了，写出来别人看不懂，
希望有人帮忙翻一下文档。 ('_`)!!