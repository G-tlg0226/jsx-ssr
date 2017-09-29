const express = require('express')
const path = require('path')
let app = express()

app.set('views', path.join(__dirname, './views'))
app.engine('.jsx', require('./../src/index')('development'))
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