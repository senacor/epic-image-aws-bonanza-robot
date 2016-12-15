import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Key from './Key.jsx'

class App extends Component {

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
