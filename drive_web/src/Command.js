import React, { Component } from 'react'

export class DirectionCommand {
	
	constructor(direction){
		this.direction = direction;
		this.move = this.move.bind(this)
	}

	move() {
		fetch(this._startUrl() , {
      		method: 'post'
      	}).then(function(response) {
        	console.log('posted command')
      	})
	}

	_startUrl() {
		return 'http://localhost:8080/drive/' + this._direction()
	}

	_direction(){
		switch (this.direction){
			case 'up' : return 'forward'
			case 'down' : return 'backward'
			default: return this.direction
		}
	}
}

export class StopCommand {

	constructor() {
		this.stop = this.stop.bind(this)
	}
	
	stop() {
		fetch('http://localhost:8080/drive/stop' , {
      		method: 'post'
      	}).then(function(response) {
        	console.log('posted stop')
      	})
	}
}