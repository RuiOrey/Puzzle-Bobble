import TWEEN from '@tweenjs/tween.js';
import {dimensions} from '../../settings';

import * as THREE from 'three';

const OBJLoader = require( 'three-obj-loader' )( THREE );
export const isShooter = ( object, parameters ) => {
  const _object = object;

  let _parameters = {
    shooterType: 'arrow',
    modelPath: '/assets/models/pointer.obj',
    mesh: null,
    color: 0x332211,
    rotation: {
      initial: Math.PI,
      speed: 0.03,
      limit: Math.PI / 2,
    },
    outline: {
      scale: 1.1,
      color: 0xffffff,
    },
  };

  this.THREE = THREE;
  const loader = new this.THREE.OBJLoader();

  loader.load(
      _parameters.modelPath,
      function( obj ) {

        _object.mesh.add( obj );
        changeObjectChildrenMaterialTo( obj,
            new THREE.MeshLambertMaterial(
                {color: _parameters.color} ) );
        computeChildrenNormals( obj );
        const _objOutline = obj.clone();
        _objOutline.scale.set(
            _parameters.outline.scale,
            _parameters.outline.scale,
            _parameters.outline.scale );

        changeObjectChildrenMaterialTo( _objOutline,
            new THREE.MeshBasicMaterial(
                {color: _parameters.outline.color, side: THREE.BackSide} ) );
        obj.add( _objOutline );
        state.mesh = obj;

      },
      function( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      function( error ) {

        console.log( 'An error happened' );

      },
  );

  initEventListeners( object, _parameters );
  setParentGameObjectTransforms( object, _parameters );

  let state = {
    mesh: _parameters.mesh,
  };

  return {
    shooter: state,
  };
};

function changeObjectChildrenMaterialTo( object, material )
  {

    object.children.forEach( ( childObject ) => {
          childObject.material = material;
        },
    );
  }

function computeChildrenNormals( object )
  {
    object.children.forEach( ( childObject ) => {
      const _oldGufferGeometry = childObject.geometry;
      const _geometry = new THREE.Geometry().fromBufferGeometry(
          _oldGufferGeometry );
      childObject.geometry = _geometry;
      childObject.geometry.mergeVertices();
      childObject.geometry.computeVertexNormals( true );
      childObject.geometry.needsUpdate = true;
      _oldGufferGeometry.dispose();
    } );
  }

function getLowerHeightPositionFromBoardDimensions( settings )
  {
    const _lines = settings.lines / 2 + 1;
    const height = -_lines * settings.scale;
    return new THREE.Vector3( 0, height, 0 );
  };

function initEventListeners( object, parameters )
  {
    document.addEventListener( 'moveright', function() {
      if ( object.mesh.rotation.z - parameters.rotation.initial <
          -parameters.rotation.limit )
        {
          return;
        }
      object.mesh.rotation.z -= parameters.rotation.speed;
    } );
    document.addEventListener( 'moveleft', function() {
      if ( object.mesh.rotation.z - parameters.rotation.initial >
          parameters.rotation.limit )
        {
          return;
        }
      object.mesh.rotation.z += parameters.rotation.speed;
    } );
    document.addEventListener( 'shoot', function() {
      console.log( 'shoot' );
    } );
  }


let setParentGameObjectTransforms = function( object, _parameters ) {
  object.mesh.position.copy(
      getLowerHeightPositionFromBoardDimensions( dimensions ) );
  object.mesh.rotation.z = _parameters.rotation.initial;
  object.mesh.scale.set( dimensions.scale, dimensions.scale, dimensions.scale );
};
