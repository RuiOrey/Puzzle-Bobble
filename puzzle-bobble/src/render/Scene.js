import React, {Component} from 'react';

import * as THREE from 'three';

import {BoardPrefab} from '../logic/prefabs/BoardPrefab';
import {SkyboxPrefab} from '../logic/prefabs/SkyBoxPrefab';
import {ShooterPrefab} from '../logic/prefabs/ShooterPrefab';

export class Scene extends Component {

  scene = new THREE.Scene();
  children = [];

  componentDidMount()
    {
      //debug
      window.sceneChildren = this.children;
      // this.scene.fog = new THREE.Fog( 0x222222, 0.015, 200 );
      //this.initGrid();
      this.initAxes();
      this.initLights();
    }

  componentWillReceiveProps( nextProps )
    {
      console.log( 'Scene componentWillReceiveProps:', nextProps );
    }

  initLights()
    {
      const light = new THREE.PointLight( 0xFFFFFF, 1, 100 );
      light.position.set( 10, 7, 5 );

      light.castShadow = true;
      light.shadow.mapSize = new THREE.Vector2( 1024, 1024 );

      this.scene.add( light );

      const ambient_light = new THREE.AmbientLight( 0x222222, 5 ); // soft white light
      this.scene.add( ambient_light );

      // const light2 = new THREE.PointLight( 0xFFFFFF, 1, 100 );
      // light2.position.set( 0, 0, 0 );
      // light2.castShadow = true;
      // this.logo.add( light2 );
    }

  initGrid()
    {

      const size = 2000;
      const divisions = 1000;

      const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
      planeGeometry.rotateX( -Math.PI / 2 );
      const planeMaterial = new THREE.MeshPhongMaterial( {
        opacity: 0.8, transparent: true, depthWrite: false,
      } );
      const plane = new THREE.Mesh( planeGeometry, planeMaterial );
      plane.position.y = -0.1;
      plane.receiveShadow = true;
      plane.material.transparent = true;
      plane.renderOrder = 100;
      this.scene.add( plane );

      const gridHelper = new THREE.GridHelper( size, divisions );
      //gridHelper.castShadow = true;

      this.scene.add( gridHelper );
    }

  update = () => {
    this.children.forEach( ( child ) => {
      child._update();
    } );
  };

  initAxes()
    {

      const axesHelper = new THREE.AxesHelper( 5 );
      this.scene.add( axesHelper );
    }

  addChild = ( child ) => {
    if ( child.mesh )
      {
        this.scene.add( child.mesh );
      }
    this.children.push( child );
  };

  render()
    {
      console.log( 'Scene render props:', this.props );
      return <div><BoardPrefab ref={this.addChild}></BoardPrefab>
        <ShooterPrefab ref={this.addChild}></ShooterPrefab>
        <SkyboxPrefab ref={this.addChild}></SkyboxPrefab>Scene</div>;
    }
}