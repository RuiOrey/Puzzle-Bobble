import * as THREE from 'three';
import {dimensions} from '../../settings';

export const isGridBoard = ( parent, parameters ) => {

  let _grid, _border = {left: null, top: null, right: null}, _gridArray = [],
      _debug = new THREE.Object3D();

  function _clean()
    {
      console.log( 'cleaning grid' );
    }

  function _new()
    {
      if ( _grid )
        {
          this._clean();
        }
      _grid = new THREE.Object3D();
      console.log( 'building grid' );
      _addPositions();
      _addBorder();
      _addDebugGrid();
      parent.mesh.add( _grid );

    }

  function _addPositions()
    {

      console.log( 'building grid - _addPositions' );

      const gridPositions = createGridPositions( {
        height: dimensions.lines,
        width: dimensions.columns,
        space: dimensions.scale,
        color: 0x00ff00,
      } );
      _grid.add( gridPositions.mesh );
    }

  function _addBorder()
    {

      console.log( 'building grid - _addBorder' );

      let _parameters = {
        skyboxType: 'sphere',
        texture: '/assets/img/sky.png',
        radius: 100,

      };
      let _texture;
      const border = new THREE.Object3D();
      const material = new THREE.MeshLambertMaterial( {
        opacity: 0.8,
        transparent: true,
        metalness: .5,
        roughness: 0,

      } );

      const loader = new THREE.TextureLoader();

      loader.load( _parameters.texture,

          function( texture ) {
            _texture = texture;
            _texture.minFilter = THREE.LinearFilter;
            _texture.magFilter = THREE.LinearFilter;
            _texture.repeat.set( 1, 1 );

            // _texture.wrapS = THREE.MirroredRepeatWrapping;
            // _texture.wrapT = THREE.MirroredRepeatWrapping;

            if ( material )
              {
                material.color = new THREE.Color( 1, 1, 1 );
                // material.envMap = texture;

                material.map = texture;
                material.needsUpdate = true;

                const borderSideGeometry = new THREE.BoxGeometry(
                    dimensions.borderThickness, dimensions.lines *
                    dimensions.scale );
                const borderTopGeometry = new THREE.BoxGeometry( dimensions.columns *
                    dimensions.scale + dimensions.borderThickness * 2,
                    dimensions.borderThickness );

                _border.left = new THREE.Mesh( borderSideGeometry, material );
                _border.right = new THREE.Mesh( borderSideGeometry, material );
                _border.top = new THREE.Mesh( borderTopGeometry, material );

                _border.left.scale.y = -1;
                _border.right.scale.y = -1;
                _border.top.scale.y = -1;

                const _sideDisplacement = 0.5 * dimensions.columns *
                    dimensions.scale + dimensions.borderThickness / 2;

                border.add( _border.left );
                _border.left.position.set( _sideDisplacement, 0, 0 );

                border.add( _border.right );
                _border.right.position.set( -_sideDisplacement, 0, 0 );

                const _topDisplacement = 0.5 * dimensions.lines *
                    dimensions.scale + dimensions.borderThickness / 2;

                border.add( _border.top );
                _border.top.position.set( 0, _topDisplacement, 0 );

                _grid.add( border );

              }

          },
          undefined,
          function( err ) {
            console.error( 'An error loading texture happened.' );
          },
      );

    }

  function _addDebugGrid()
    {

      console.log( 'building grid - _addDebugGrid' );

      _grid.add( _debug );
      const gridBackground = _addGridBackgroundPlane();
      _debug.add( gridBackground );

      const gridLines = createGridLines( {
        height: dimensions.lines,
        width: dimensions.columns,
        space: dimensions.scale,
        color: 0x00ff00,
      } );
      _debug.add( gridLines );

    }

  const _addGridBackgroundPlane = function() {
    const planeGeometry = new THREE.PlaneGeometry( dimensions.columns *
        dimensions.scale, dimensions.lines * dimensions.scale );
    //planeGeometry.rotateX( -Math.PI / 2 );
    const planeMaterial = new THREE.MeshPhongMaterial( {
      opacity: 0.8, transparent: true, depthWrite: false, color: 0xff0000,
    } );
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.material.transparent = true;
    plane.renderOrder = 100;
    return plane;
  };

//----------------------------------------------------------------------------
// adapted from :
// https://bocoup.com/blog/learning-three-js-with-real-world-challenges-that-have-already-been-solved
//----------------------------------------------------------------------------
  function createGridLines( opts )
    {

      let config = Object.assign( {

        height: 500,
        width: 500,
        space: 10,
        color: 0x0000ff,
      }, opts );

      let material = new THREE.LineBasicMaterial( {
        color: config.color,
        opacity: 0.9,
      } );

      let gridObject = new THREE.Object3D(),
          gridGeo = new THREE.Geometry(),
          width = config.space * (config.width / 2),
          height = config.space * (config.height / 2),
          step = config.space;

      //width
      for ( let i = -width; i <= width; i += step )
        {
          gridGeo.vertices.push( new THREE.Vector3( i, -height, 0 ) );
          gridGeo.vertices.push( new THREE.Vector3( i, height, 0 ) );

        }
      //height
      for ( let i = -height; i <= height; i += step )
        {
          gridGeo.vertices.push( new THREE.Vector3( -width, i, 0 ) );
          gridGeo.vertices.push( new THREE.Vector3( width, i, 0 ) );
        }

      let line = new THREE.Line( gridGeo, material, THREE.LinePieces );
      gridObject.add( line );

      return gridObject;
    }

  function createGridPositions( opts )
    {

      const config = Object.assign( {

        height: 500,
        width: 500,
        space: 10,
        color: 0x00ff00,
      }, opts );

      _gridArray.splice( 0, _gridArray.length );
      const gridObject = new THREE.Object3D(),
          width = config.space * (config.width / 2),
          height = config.space * (config.height / 2),
          step = config.space;

      const gridGeo = new THREE.BoxGeometry( step - 0.1, step - 0.1 );

      //for each line
      for ( let x = -height + step / 2; x <= height - step / 2; x += step )
        {
          let _heightArray = [];
          for ( let y = -width + step / 2; y <= width - step / 2; y += step )
            {
              const newGridPosition = new GridPosition( gridGeo, config.color );
              _heightArray.push( newGridPosition );
              gridObject.add( newGridPosition.mesh );
              newGridPosition.mesh.position.set( y, x, 0 );
            }
          _gridArray.push( _heightArray );
        }
      // console.log( _gridArray );
      // we should have an array with the boxes and they should be on gridObject

      return {mesh: gridObject, array: _gridArray};
    }

  function GridPosition( geometry, color )
    {

      const material = new THREE.MeshBasicMaterial( {

        color: color,
        opacity: 0.5,
        transparent: true,
      } );
      const _mesh = new THREE.Mesh( geometry, material );
      this.ball = null;
      let _returnObject = {
        get mesh() {
          return _mesh;
        },
        activate: ( state, ball ) => {
          this.ball = ball ? ball : null;
          _mesh.material.color = new THREE.Color( this.state[state].color );
        },
        set visible( value ) {
          _mesh.material.tranparent = value;
          _mesh.material.opacity = value ? 0.8 : 0.0;
        },
      };

      _returnObject.prototype = GridPosition.prototype;
      return _returnObject;
    }

  GridPosition.prototype.state = {
    inactive: {color: 0x0000ff},
    ready: {color: 0x00ff00},
    trespassing: {color: 0xff0000},
    occupied: {color: 0x000000},

  };

  const update = ( id ) => {
    randomColorBox();
  };

  const randomColorBox = () => {
    let _randomSlotLineID = Math.floor( Math.random() *
        (_gridArray.length ) );
    let _randomSlotColumnID = Math.floor( Math.random() *
        (_gridArray[0].length ) );

    const _stateID = Object.keys( GridPosition.prototype.state );

    let _randomState = Math.floor( Math.random() *
        (_stateID.length ) );

    _gridArray[_randomSlotLineID][_randomSlotColumnID].activate(
        _stateID[_randomState] );
  };

  let state = {
    dimensions: dimensions,
    new: _new,
    set debug( value ) {
      if ( !_debug )
        {
          console.log( 'debug is not defined' );
          return;
        }

      _gridArray.forEach( ( gridLine ) => {
        gridLine.forEach( ( gridPosition ) => {
          gridPosition.visible = value;
        } );
      } );

      _debug.visible = value;
    },
    get debug() {
      if ( !_debug )
        {
          console.log( 'debug is not defined' );
          return _grid;
        }
      return _debug.visible;
    },
    slots: _gridArray,
    border: _border,
    update: update,
  };
  return {gridboard: state};
};
