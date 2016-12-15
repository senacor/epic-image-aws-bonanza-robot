import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Key from './Key.jsx'

class App extends Component {

  constructor () {
    super()
    this.down = this.down.bind(this)
    this.up = this.up.bind(this)
  }

  click () {
    fetch('http://localhost:8080/camera/click', {
          method: 'post'
        }).then(function(response) {
          console.log('posted click')
        })
  }

  down (event) {
    switch (event.key) {
      case 'ArrowUp': this.refs.up.start()
        break
      case 'ArrowDown': this.refs.down.start()
        break
      case 'ArrowLeft': this.refs.left.start()
        break
      case 'ArrowRight': this.refs.right.start()
        break
    }
  }

  up (event) {
    switch (event.key) {
      case 'ArrowUp': this.refs.up.stop()
        break
      case 'ArrowDown': this.refs.down.stop()
        break
      case 'ArrowLeft': this.refs.left.stop()
        break
      case 'ArrowRight': this.refs.right.stop()
        break
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
            <Key ref="up" direction="up"/>
          </div>
          <div className="App-intro container">
            <Key ref="left" direction="left"/>
            <Key ref="down" direction="down"/>
            <Key ref="right" direction="right"/>
          </div>
          <div className="App-intro">
            <img src="camera.png" alt="click" onClick={this.click}/>
          </div>
        </div>
      </div>
    )
  }

}

export default App
