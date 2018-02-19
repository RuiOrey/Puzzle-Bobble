import React, { Component } from 'react';
import { GameObject } from '../GameObject';
import { isShooter } from "../components/ShooterComponent";

export class ShooterPrefab extends GameObject {


    buildComponents = () => {
        this.parameters = this.props.parameters ? this.props.parameters : {};
        this.parameters = Object.assign( { shooter: {} }, this.parameters );
        Object.assign( this.components, isShooter( this, this.parameters.shooter ) );
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