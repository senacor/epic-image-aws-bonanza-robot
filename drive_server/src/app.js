var express = require('express')
var app = express()

// Add headers
app.use(function (reqest, response, next) {
  // Website you wish to allow to connect
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000')
  // Request methods you wish to allow
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  // Request headers you wish to allow
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  next()
})

app.post('/drive/:command', function (request, response) {
  let command = request.params.command
  if (['forward', 'backward', 'stop', 'left', 'right'].indexOf(command) >= 0) {
    console.log('executing command ' + command)
  } else {
    response.status(404).json('Unknown command: ' + command)
  }
})

app.listen(8080, function () {
  console.log('Awesome drive server listening on port 8080')
})
