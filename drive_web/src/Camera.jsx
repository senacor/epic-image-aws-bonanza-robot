import React, { Component } from 'react'

class Camera extends Component {

  constructor () {
    super()
    this.state = {
      pressed: false
    }
    this.down = this.down.bind(this)
    this.up = this.up.bind(this)
  }

  down () {
    if (!this.state.pressed) {
      this.setState({'pressed': true})
    }
  }

  up () {
    this.setState({'pressed': false})
      fetch('http://localhost:8080/camera/click', {
        	method: 'post'
      }).then(function(response) {
          console.log('posted click')
        })
  }

  render () {
    let myClassName = this.state.pressed ? 'transbox' : 'img-responsive'
    return (
      <div>
        <img src="camera.png" alt="click" className={myClassName} onMouseDown={this.down} onMouseUp={this.up}/>
      </div>
    )
  }
}

export default Camera
