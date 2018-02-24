import React, { Component } from 'react';
import { GameObject } from '../GameObject';
import { isShooter } from "../components/ShooterComponent";
import { isTraveler } from "../components/TravelerComponent";
import { _dimensions } from '../../settings'

export class ShooterPrefab extends GameObject {


    buildComponents = () => {
        this.parameters = this.props.parameters ? this.props.parameters : {};
        this.parameters = Object.assign( { shooter: {} }, this.parameters );
        Object.assign( this.components, isShooter( this, this.parameters.shooter ) );
        Object.assign( this, isTraveler( this.mesh ) );
    }

    start = () =>{
        getPositionFromBoardDimensions(_dimensions);
    }

    getPositionFromBoardDimensions = (settings) => {
        lines: 10,
            columns: 10,
            scale: 2,
            borderThickness: 0.75
    }

    initComponents() {
        //this.mesh.add( this.components.skybox.mesh );
    }

    update = ()=> {

        this.mesh.rotation.y += 0.0001;
    }

    render() {
        return null;
    }
}