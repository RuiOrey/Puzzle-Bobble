import React, { Component } from 'react';

import * as THREE from 'three';

export class Camera extends Component {

    attribs = {
        fov: 45,
        aspect: window.innerWidth / window.innerHeight,
        near: .1,
        far: 1000
    };
    mesh = new THREE.PerspectiveCamera( this.attribs.fov, this.attribs.aspect, this.attribs.near, this.attribs.far );

    componentDidMount() {
        this.setupInitialValues();
        this.setupResize();
    };

    setupInitialValues() {
        this.mesh.position.set( 8.3, 18.2, 25 );
        //TODO - remove later - debug

        window.camera = this;
        window.THREE = THREE;
    }

    setupResize() {
        window.addEventListener( "resize", () => {
            //      console.log( "adjusting camera", this.camera )
            this.mesh.aspect = window.innerWidth / window.innerHeight;
            this.mesh.updateProjectionMatrix();
        } );
    }


    render() {
        return <div>Camera</div>;
    }
}