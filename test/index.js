// import { resolve } from 'dns';

const express = require('express')
const path = require('path')
// let expressAPP = express()

// expressAPP.set('views', path.join(__dirname, './views'))
// expressAPP.engine('.jsx', require('./../src/index')('development'))
// expressAPP.set('view engine', 'jsx')


// expressAPP.get('/', (req, res, next) => {
// 	res.render('index', {
// 		users: [
// 			{ id: 1, name: '王小明', age: 20, gender: '男' },
// 			{ id: 2, name: '李小花', age: 22 },
// 			{ id: 3, name: '韩梅梅', age: 25, gender: '女' },
// 			{ id: 4, name: '张敏敏', age: 18, gender: '女' },
// 			{ id: 5, name: '吴自有', age: 23, gender: '男' }
// 		]
// 	})
// })
// expressAPP.listen(30003)

const Koa = require('koa'),
	Router = require('koa-router'),

	app = new Koa(),
	router = new Router(),
	jsxv = require('./../src/index')('development')
// 
app.jsxv = function (key, val) {
	return new Promise((resolve, reject) => {
		jsxv(path.join(__dirname, key), val, function (err, html) {
			if (err) {
				reject(null)
			} else {
				resolve(html)
			}
		})
	})
}

router.get('/', (ctx, next) => {
	let data = {
		users: [
			{ id: 1, name: '王小明', age: 20, gender: '男' },
			{ id: 2, name: '李小花', age: 22 },
			{ id: 3, name: '韩梅梅', age: 25, gender: '女' },
			{ id: 4, name: '张敏敏', age: 18, gender: '女' },
			{ id: 5, name: '吴自有', age: 23, gender: '男' }
		]
	},
		iter = ctx.app.jsxv('./views/index.jsx', data)

	iter.then(res => {
		if (res) {
			ctx.body = res
		}
	})
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(30003)