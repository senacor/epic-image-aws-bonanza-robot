import React, { Component } from 'react'

class Gear extends Component {

  constructor () {
    super()
    this.state = {
      gear: '1'
    }
    this.up = this.up.bind(this)
    this.down = this.down.bind(this)
    this._changeGear = this._changeGear.bind(this)
  }

  up () {
    let gear = this.state.gear
    switch (gear) {
      case '1': this._changeGear('2')
        break
      case '2': this._changeGear('3')
        break
      default:
    }
  }

  down () {
    let gear = this.state.gear
    switch (gear) {
      case '2': this._changeGear('1')
        break
      case '3': this._changeGear('2')
        break
      default:
    }
  }

  render () {
    return (
      <div>
        <button className="up" onClick={this.up}></button>
        <label>{this.state.gear}</label>
        <button className="down" onClick={this.down}></button>
      </div>
    )
  }

_changeGear (gear) {
  let self = this
    fetch('http://localhost:8080/gear/' + gear  , {
          method: 'post'
        }).then(function(response) {
          console.log('changed gear')
          self.setState({
            gear: gear
          })
        })
  }
}

export default Gear
