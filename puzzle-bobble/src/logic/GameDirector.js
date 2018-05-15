import React, { Component } from 'react';


export class GameDirector extends Component {

    shooter = null;
    board = null;
    activeBall = null;
    physicsManager=null;

    //TODO: should go to game director
    ballStates = {
        inactive: {color: 0x0000ff},
        ready: {color: 0x00ff00},
        trespassing: {color: 0xff0000},
        occupied: {color: 0x000000},

    };

    componentDidMount = () => {

    }


    render() {
        return null;
    }

    update = ( timeOfCurrentUpdateCallInMilliseconds ) => {

  
    }

}