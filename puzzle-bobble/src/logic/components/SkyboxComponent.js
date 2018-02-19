import   TWEEN  from '@tweenjs/tween.js';

import * as THREE from 'three';

export const isSkybox = ( object, parameters ) => {
    const _object = object;

    let _parameters = {
        skyboxType: "sphere",
        texture: "/assets/img/sky.png",
        radius: 100

    }

    const loader = new THREE.TextureLoader();
    let _texture;
    loader.load(
        _parameters.texture,

        function ( texture ) {
            _texture = texture;
            _texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.repeat.set( 2, 1 );
            if ( _skybox ) {
                _skybox.material.envMap = texture;
                _skybox.material.map = texture;
                _skybox.material.needsUpdate = true;
            }
        },
        undefined,
        function ( err ) {
            console.error( 'An error loading texture happened.' );
        }
    );

    const _material = new THREE.MeshStandardMaterial( {
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0,
        roughness: 0.2,
        metalness: 0.5

    } );

    const _skyboxGeo = new THREE.SphereGeometry( _parameters.radius );

    const _skybox = new THREE.Mesh( _skyboxGeo, _material );


    let state = {
        mesh: _skybox
    };

    return {
        skybox: state
    };
}
