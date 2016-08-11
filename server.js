const express = require('express')
const app = express()
const port = 3000

app.use(express.static('.'))

app.get('/', (request, response) => {
	response.sendFile('index.html')
})

app.get('/about', (request, response) => {
	response.send('Here\'s where your about page can go!')
})

app.listen(port, (err) => {
	if(err){
		return console.log("There was an error", err)
	}

	console.log(`server is listening on ${port}`)
})