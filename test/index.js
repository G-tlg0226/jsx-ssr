const express = require('express')
const path = require('path')
let app = express()

app.set('views', path.join(__dirname, './views'))
app.engine('jsx', require('./../src/index').__express)
app.set('view engine', 'jsx')


app.get('/', (req, res, next) => {
	res.render('index.jsx', { name: '康康', age: 30 })
})


app.listen(3000)