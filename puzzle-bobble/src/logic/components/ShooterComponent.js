import   TWEEN  from '@tweenjs/tween.js';

import * as THREE from 'three';
const OBJLoader = require( 'three-obj-loader' )( THREE );


export const isShooter = ( object, parameters ) => {
    const _object = object;

    let _parameters = {
        shooterType: "arrow",
        modelPath: "/assets/models/pointer.obj",
        mesh: null

    }

    this.THREE = THREE;
    const loader = new this.THREE.OBJLoader();

// instantiate a loader
//     var loader = new THREE.OBJLoader();

// load a resource
    loader.load(
        // resource URL
        _parameters.modelPath,
        function ( obj ) {

            _object.mesh.add( obj );
            state.mesh = obj

        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        function ( error ) {

            console.log( 'An error happened' );

        }
    );


    let state = {
        mesh: _parameters.mesh
    };

    return {
        shooter: state
    };
}

