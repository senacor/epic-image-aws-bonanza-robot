import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Key from './Key.jsx'
import {DirectionCommand, StopCommand} from './Command'

class App extends Component {

  constructor () {
    super()
    this.down = this.down.bind(this)
    this.up = this.up.bind(this)
  }

  move (direction) {
    new DirectionCommand(direction).move()
  }

  stop (event) {
    new StopCommand().stop()
  }

  down (event) {
    if (event.key !== this.buttonPressed) {
      this.buttonPressed = event.key
      this.move(this._translateDirection(event.key))
    }
  }

  up (event) {
    if (event.key === this.buttonPressed) {
      this.stop()
    }
  }

  _translateDirection (direction) {
    switch (direction) {
      case 'ArrowUp' : return 'up'
      case 'ArrowDown' : return 'down'
      case 'ArrowLeft' : return 'left'
      case 'ArrowRight' : return 'right'
    }
  }

  render () {
    return (
      <div tabIndex="0" onKeyDown={this.down} onKeyUp={this.up}>
        <div className="App" >
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Drive the slowest car in the world!</h2>
          </div>
          <div className="App-intro container">
            <Key direction="up"/>
          </div>
          <div className="App-intro container">
            <Key direction="left"/>
            <Key direction="down"/>
            <Key direction="right"/>
          </div>
        </div>
      </div>
    )
  }

}

export default App
