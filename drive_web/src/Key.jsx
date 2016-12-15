import React, { Component } from 'react'
import {StopCommand, DirectionCommand} from './Command'
import classNames from 'classnames'

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
    this.setState({pressed: true})
    new DirectionCommand(this.props.direction).move()
  }

  stop () {
    this.setState({pressed: false})
    new StopCommand().stop()
  }

  render () {
    let myClassName = this.state.pressed ? 'transbox' : 'img-responsive'
    return (
      <div>
        <img src={this._image()} alt={this.props.direction} className={myClassName} onMouseDown={this.start} onMouseUp={this.stop}/>
      </div>
    )
  }

  _image () {
    return this.props.direction + '.png'
  }

  _translateDirection (direction) {
    switch (direction) {
      case 'ArrowUp' : return 'up'
      case 'ArrowDown' : return 'down'
      case 'ArrowLeft' : return 'left'
      case 'ArrowRight' : return 'right'
    }
  }

}

export default Key
