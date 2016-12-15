import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Images from './Images'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Epic Image Robot / Display</h2>
        </div>
        <Images />
      </div>
    );
  }
}

export default App;
