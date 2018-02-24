import React, { Component } from 'react';
import { GameObject } from '../GameObject';
import { isShooter } from "../components/ShooterComponent";
import { isTraveler } from "../components/TravelerComponent";
import { dimensions } from '../../settings'
import * as THREE from "three";

export class ShooterPrefab extends GameObject {


    buildComponents = () => {
        this.parameters = this.props.parameters ? this.props.parameters : {};
        this.parameters = Object.assign( { shooter: {} }, this.parameters );
        Object.assign( this.components, isShooter( this, this.parameters.shooter ) );
        Object.assign( this, isTraveler( this.mesh ) );
    }

    start = () =>{
        this.mesh.position.copy( this.getPositionFromBoardDimensions(dimensions));
    }

    getPositionFromBoardDimensions = (settings) => {
        const _lines = settings.lines / 2;
        const height = -(_lines * settings.scale);
        return new THREE.Vector3(0, height, 0)
        // lines: 10,
        //     columns: 10,
        //     scale: 2,
        //     borderThickness: 0.75
    }

    initComponents() {
        //this.mesh.add( this.components.skybox.mesh );
    }

    update = ()=> {

        // this.mesh.rotation.z += 0.1;
    }

    render() {
        return null;
    }
}