let mqtt = require('mqtt')
let client = mqtt.connect('mqtt://10.22.0.204')

const FORWARD = 'forward'
const BACKWARD = 'backward'
const STOP = 'stop'
const LEFT = 'left'
const RIGHT = 'right'

var sendCommand = function (command) {
  console.log('executing command ' + command)
  client.publish('robot/drive', command)
}

var sendClick = function () {
  console.log('sending click ')
  client.publish('robot/camera', 'click')
}

module.exports = {sendCommand, sendClick, FORWARD, BACKWARD, STOP, LEFT, RIGHT}
