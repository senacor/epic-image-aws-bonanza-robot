import React, { Component } from 'react'
import {StopCommand, DirectionCommand} from './Command'

class Key extends Component {

  constructor () {
    super()
    this.state = {
      pressed: false
    }

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
  }

  start () {
    new DirectionCommand(this.props.direction).move()
  }

  stop () {
    new StopCommand().stop()
  }

  render () {
    return (
      <div><img src={this._image()} alt={this.props.direction} class="img-responsive" onMouseDown={this.start} onMouseUp={this.stop}/></div>
    )
  }

  _image () {
    return this.props.direction + '.png'
  }

}

export default Key
