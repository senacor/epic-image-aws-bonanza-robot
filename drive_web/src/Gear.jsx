import React, { Component } from 'react'

class Gear extends Component {

  constructor () {
    super()
    this.state = {
      gear: '1'
    }
    this.activate1 = this.activate1.bind(this)
    this.activate2 = this.activate2.bind(this)
    this.activate3 = this.activate3.bind(this)
    this._changeGear = this._changeGear.bind(this)
  }

  activate1 () {
    this._changeGear('1')
  }

  activate2 () {
    this._changeGear('2')
  }

  activate3 () {
    this._changeGear('3')
  }

  render () {
    let activeGear1 = (this.state.gear === '1') ? 'activeGear' : ''
    let activeGear2 = (this.state.gear === '2') ? 'activeGear' : ''
    let activeGear3 = (this.state.gear === '3') ? 'activeGear' : ''
    return (
      <div>
        <button className={activeGear1} onClick={this.activate1}>Gear 1</button>
        <button className={activeGear2} onClick={this.activate2}>Gear 2</button>
        <button className={activeGear3} onClick={this.activate3}>Gear 3</button>
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
