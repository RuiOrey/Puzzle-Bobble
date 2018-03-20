import React, { Component } from 'react';
import * as CANNON from 'cannon';


export class PhysicsManager extends Component {

    world = new CANNON.World( {
        // gravity: new CANNON.Vec3( 0, -9.82, 0 )
        gravity: new CANNON.Vec3( 0, 0, 0 )
    } );
    fixedTimeStep = 1.0 / 60.0; // seconds
    maxSubSteps = 3;
    TimeOfLastUpdateCallInMilliseconds;

    componentDidMount = () => {

    }

    generateUpdateFunction = ( mesh, body )=> {

        return function updateFunction() {
            mesh.position.x = body.position.x;
            mesh.position.y = body.position.y;
            mesh.position.z = body.position.z;
            mesh.quaternion.x = body.quaternion.x;
            mesh.quaternion.y = body.quaternion.y;
            mesh.quaternion.z = body.quaternion.z;
            mesh.quaternion.w = body.quaternion.w;
        }
    }

    Vec3 = (x,y,z) =>   {
        return new CANNON.Vec3(x,y,z);
    }
    

    addNewSphereBody( mesh, parameters ) {

        let thisSphereParameters = {
            mass: 5,
            position: { x: 0, y: 0, z: 0 },
            radius: 1,
            linearFactor: new  CANNON.Vec3(1,1,1),
            angularFactor: new  CANNON.Vec3(1,1,1)
        };

        const _parameters = Object.assign( thisSphereParameters, parameters );

        const _sphereBody = new CANNON.Body( {
            mass: _parameters.mass, // kg
            position: new CANNON.Vec3( _parameters.position.x, _parameters.position.y, _parameters.position.z ), // m
            shape: new CANNON.Sphere( _parameters.radius ),
            linearFactor : _parameters.linearFactor,
            angularFactor : _parameters.angularFactor

        } );
        this.world.addBody( _sphereBody );

        // _sphereBody.addEventListener( "collide", function ( event ) {
        //     console.log( "[Body] - collide: ", event );
        // } )

        const _updateFunction = this.generateUpdateFunction( mesh, _sphereBody );

        return { body: _sphereBody, update: _updateFunction, parameters: _parameters };
    }

    addNewBoxBody( mesh, parameters ) {

        let thisBoxParameters = {
            mass: 1,
            position: { x: 0, y: 0, z: 0 },
            dimensions: { x: 1, y: 1, z: 1 },
            linearFactor: new  CANNON.Vec3(1,1,0),
            angularFactor: new  CANNON.Vec3(1,1,0)
        };

        const _parameters = Object.assign( thisBoxParameters, parameters );

        const _boxBody = new CANNON.Body( {
            mass: _parameters.mass,
            position: new CANNON.Vec3( _parameters.position.x, _parameters.position.y, _parameters.position.z ), // m
            shape: new CANNON.Box( new CANNON.Vec3( _parameters.dimensions.x, _parameters.dimensions.y, _parameters.dimensions.z ) ),
            linearFactor : _parameters.linearFactor,
            angularFactor : _parameters.angularFactor
        } );

        this.world.addBody( _boxBody );

        const _updateFunction = this.generateUpdateFunction( mesh, _boxBody );

        return { body: _boxBody, update: _updateFunction, parameters: _parameters };
    }

    render() {
        return null;
    }

    update = ( timeOfCurrentUpdateCallInMilliseconds ) => {

        if ( this.TimeOfLastUpdateCallInMilliseconds !== undefined ) {
            const deltaTimeSinceLastUpdateInMilliseconds = (timeOfCurrentUpdateCallInMilliseconds - this.TimeOfLastUpdateCallInMilliseconds) / 1000;
            this.world.step( this.fixedTimeStep, deltaTimeSinceLastUpdateInMilliseconds, this.maxSubSteps );
        }
        this.TimeOfLastUpdateCallInMilliseconds = timeOfCurrentUpdateCallInMilliseconds;
    }

}