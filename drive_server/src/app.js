let sendCommand = require('./send-command')
let express = require('express')
let cors = require('cors')
let app = express()

app.use(cors())

app.post('/drive/:command', function (request, response) {
  let command = request.params.command
  if ([sendCommand.FORWARD, sendCommand.BACKWARD, sendCommand.STOP, sendCommand.LEFT, sendCommand.RIGHT].indexOf(command) >= 0) {
    sendCommand.sendCommand(command)
    response.end()
  } else {
    response.status(404).json('Unknown command: ' + command)
    response.end(404)
  }
})

app.post('/camera/:command', function (request, response) {
  sendCommand.sendClick()
  response.end()
})

app.listen(8080, function () {
  console.log('Awesome drive server listening on port 8080')
})
