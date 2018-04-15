import * as _ from 'lodash';

import {dimensions} from '../../settings';
import * as THREE from 'three';

// remove this
import * as CANNON from 'cannon';

export const isBall = ( gameObject, parameters ) => {
  const config = Object.assign( {
    height: dimensions.lines,
    width: dimensions.columns,
    space: dimensions.scale,
    soundLocation: '/assets/sound/shot.wav',
    color: 0x00ff00,
  }, {} );

  const _audioManager = gameObject.props.getAudioManager();
  const sound = _audioManager.buildPositionalSound( config.soundLocation );

  const linearDamping = 0.00;
  const angularDamping = 0.00;

  const step = config.space;
  const gridGeoRadius = (step - 0.1) / 2;

  const gridGeo = new THREE.SphereGeometry( gridGeoRadius );
  const material = new THREE.MeshBasicMaterial( {

    color: config.color,
    opacity: 0.5,
    transparent: true,
  } );
  const _mesh = new THREE.Mesh( gridGeo, material );
  _mesh.name = _.uniqueId( 'Ball' );

  let shooterRotation = 3.14;
  _mesh.add( sound );
  gameObject.mesh.add( _mesh );
  //
  // _mesh.position.copy(
  //     getLowerHeightPositionFromBoardDimensions( dimensions ) );
  //_mesh.scale.set( dimensions.scale, dimensions.scale, dimensions.scale );

  const _physicsManager = gameObject.props.getPhysicsManager();
  const _physicsRepresentation = _physicsManager.addNewSphereBody( _mesh, {
        radius: gridGeoRadius,
        position: getLowerHeightPositionFromBoardDimensions( dimensions ),
        mass: 0,
        type: CANNON.Body.DYNAMIC,
        linearFactor: new _physicsManager.Vec3( 1, 1, 0 ),
        angularFactor: new _physicsManager.Vec3( 1, 1, 0 ),
        linearDamping: linearDamping,
        angularDamping: angularDamping,
      } )
  ;

  console.log( _physicsRepresentation.body );

  document.addEventListener( 'shooterRotation', function( e ) {
    shooterRotation = e.detail.rotation;
  } );

  _physicsRepresentation.body.addEventListener( 'collide', ( e ) => {

    console.log( e );
    const _collidedBody = e.contact.bi === _physicsRepresentation.body ?
        e.contact.bj :
        e.contact.bi;
    console.log( _collidedBody );
    if ( !_collidedBody.mesh.name.includes( 'Border' ) )
      {
        return;
      }
    if ( sound.isPlaying )
      {
        sound.stop();
      }
    sound.play();
  } );

  document.addEventListener( 'shoot', function() {
    _physicsRepresentation.body.position.copy(
        _physicsRepresentation.body.initPosition );
    // console.log( _physicsRepresentation.body, _physicsRepresentation.body.type, CANNON.Body.DYNAMIC );
    _physicsRepresentation.body.mass = _physicsRepresentation.body.mass === 0 ?
        1 :
        0;
    _physicsRepresentation.body.type = _physicsRepresentation.body.mass === 0 ?
        CANNON.Body.STATIC :
        CANNON.Body.DYNAMIC;

    _physicsRepresentation.body.updateMassProperties();

    // _physicsRepresentation.body.invMass=5;
    const rotation = (shooterRotation);
    applyForce( rotation, 30 );
  } );

  function getLowerHeightPositionFromBoardDimensions( settings )
    {
      const _lines = settings.lines / 2 + 1;
      const height = -_lines * settings.scale;
      return new THREE.Vector3( 0, height, 0 );
    };

  function attachTo( object )
    {
    }

  function detachFromCurrentObject()
    {
    }

  const update = ( id ) => {
    _physicsRepresentation.update();
  };

  function applyForce( angle, velocity = 1 )
    {
      console.log( _physicsRepresentation.body );
      _physicsRepresentation.body.velocity.y = velocity * (-Math.cos( angle ));
      _physicsRepresentation.body.velocity.x = velocity *
          Math.sin( angle );

      // _physicsRepresentation.body.velocity.y += 0.3;

    }

  let state = {

    update: update,
  };

  return {ball: state};

};