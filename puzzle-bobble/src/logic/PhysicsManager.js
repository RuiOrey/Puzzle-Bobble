import React, {Component} from 'react';
import * as CANNON from 'cannon';

export class PhysicsManager extends Component {

  world = new CANNON.World( {
    // gravity: new CANNON.Vec3( 0, -9.82, 0 )
    gravity: new CANNON.Vec3( 0, 0, 0 ),
  } );

  groundMaterial = new CANNON.Material( 'groundMaterial' );
  slipperyMaterial = new CANNON.Material( 'slipperyMaterial' );

  fixedTimeStep = 1.0 / 60.0; // seconds
  maxSubSteps = 3;
  TimeOfLastUpdateCallInMilliseconds;

  componentDidMount = () => {
    this.slipperyMaterial.restitution = 0.0;
    this.initMaterials();
  };

  initMaterials = () => {

    // Materials
    // Adjust constraint equation parameters for ground/ground contact
    const ground_ground_cm = new CANNON.ContactMaterial( this.groundMaterial,
        this.groundMaterial, {
          friction: 0.4,
          restitution: 0.3,
          contactEquationStiffness: 1e8,
          contactEquationRelaxation: 3,
          frictionEquationStiffness: 1e8,
          frictionEquationRegularizationTime: 3,
        } );
    // Add contact material to the world
    this.world.addContactMaterial( ground_ground_cm );
    // Create a slippery material (friction coefficient = 0.0)

    // The ContactMaterial defines what happens when two materials meet.
    // In this case we want friction coefficient = 0.0 when the slippery material touches ground.
    const slippery_ground_cm = new CANNON.ContactMaterial( this.groundMaterial,
        this.slipperyMaterial, {
          friction: 0,
          restitution: 1.0,
        } );
    // We must add the contact materials to the world
    this.world.addContactMaterial( slippery_ground_cm );
  };

  generateUpdateFunction = ( mesh, body ) => {

    return function updateFunction() {
      mesh.position.x = body.position.x;
      mesh.position.y = body.position.y;
      mesh.position.z = body.position.z;
      mesh.quaternion.x = body.quaternion.x;
      mesh.quaternion.y = body.quaternion.y;
      mesh.quaternion.z = body.quaternion.z;
      mesh.quaternion.w = body.quaternion.w;
    };
  };

  Vec3 = ( x, y, z ) => {
    return new CANNON.Vec3( x, y, z );
  };

  typeEnum = Object.freeze( {'kinematic': CANNON.Body.KINEMATIC} );

  addNewSphereBody( mesh, parameters )
    {

      let thisSphereParameters = {
        mass: 5,
        position: {x: 0, y: 0, z: 0},
        radius: 1,
        linearFactor: new CANNON.Vec3( 1, 1, 1 ),
        angularFactor: new CANNON.Vec3( 1, 1, 1 ),
        linearDamping: 0,
        angularDamping: 0,
      };

      const _parameters = Object.assign( thisSphereParameters, parameters );

      if ( parameters.type )
        {
          _parameters.type = this.typeEnum[parameters.type];
        }

      const _sphereBody = new CANNON.Body( {
        mass: _parameters.mass, // kg
        position: new CANNON.Vec3( _parameters.position.x,
            _parameters.position.y, _parameters.position.z ), // m
        shape: new CANNON.Sphere( _parameters.radius ),
        linearFactor: _parameters.linearFactor,
        angularFactor: _parameters.angularFactor,
        linearDamping: _parameters.linearDamping,
        angularDamping: _parameters.angularDamping,
        type: _parameters.type,
        material: this.slipperyMaterial,

      } );
      this.world.addBody( _sphereBody );

      // _sphereBody.addEventListener( "collide", function ( event ) {
      //     console.log( "[Body] - collide: ", event );
      // } )

      const _updateFunction = this.generateUpdateFunction( mesh, _sphereBody );

      return {
        body: _sphereBody,
        update: _updateFunction,
        parameters: _parameters,
      };
    }

  addNewBoxBody( mesh, parameters )
    {

      let thisBoxParameters = {
        mass: 1,
        position: {x: 0, y: 0, z: 0},
        dimensions: {x: 1, y: 1, z: 1},
        linearFactor: new CANNON.Vec3( 1, 1, 0 ),
        angularFactor: new CANNON.Vec3( 1, 1, 0 ),
        material: this.groundMaterial,
      };

      const _parameters = Object.assign( thisBoxParameters, parameters );

      const _boxBody = new CANNON.Body( {
        mass: _parameters.mass,
        position: new CANNON.Vec3( _parameters.position.x,
            _parameters.position.y, _parameters.position.z ), // m
        shape: new CANNON.Box(
            new CANNON.Vec3( _parameters.dimensions.x, _parameters.dimensions.y,
                _parameters.dimensions.z ) ),
        linearFactor: _parameters.linearFactor,
        angularFactor: _parameters.angularFactor,
        material: _parameters.material,
      } );

      this.world.addBody( _boxBody );

      const _updateFunction = this.generateUpdateFunction( mesh, _boxBody );

      return {body: _boxBody, update: _updateFunction, parameters: _parameters};
    }

  render()
    {
      return null;
    }

  update = ( timeOfCurrentUpdateCallInMilliseconds ) => {

    if ( this.TimeOfLastUpdateCallInMilliseconds !== undefined )
      {
        const deltaTimeSinceLastUpdateInMilliseconds = (timeOfCurrentUpdateCallInMilliseconds -
            this.TimeOfLastUpdateCallInMilliseconds) / 1000;
        this.world.step( this.fixedTimeStep,
            deltaTimeSinceLastUpdateInMilliseconds, this.maxSubSteps );
      }
    this.TimeOfLastUpdateCallInMilliseconds = timeOfCurrentUpdateCallInMilliseconds;
  };

}