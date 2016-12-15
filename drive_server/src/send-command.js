let mqtt = require('mqtt')
let client = mqtt.connect('mqtt://10.22.0.204')

const FORWARD = 'forward'
const BACKWARD = 'backward'
const STOP = 'stop'
const LEFT = 'left'
const RIGHT = 'right'

var send = function (command) {
  console.log('executing command ' + command)
  client.publish('robot/drive', command)
}

module.exports = {send, FORWARD, BACKWARD, STOP, LEFT, RIGHT}
