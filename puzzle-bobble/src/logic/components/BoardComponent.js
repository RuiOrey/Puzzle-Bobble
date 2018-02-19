import * as THREE from 'three';

export const isGridBoard = ( parent, parameters ) => {
    let _dimensions = {
        lines: 10,
        columns: 7,
        scale: 2,
        borderThickness: 1
    };

    let _grid, _border = { left: null, top: null, right: null }, _gridArray = [], _debug = new THREE.Object3D();

    function _clean() {
        console.log( "cleaning grid" );
    }

    function _new() {
        if ( _grid ) {
            this._clean();
        }
        _grid = new THREE.Object3D();
        console.log( "building grid" );
        _addPositions();
        _addBorder();
        _addDebugGrid();
        parent.mesh.add( _grid )

    }

    function _addPositions() {

        console.log( "building grid - _addPositions" );

        const gridPositions = createGridPositions( {
            height: _dimensions.lines,
            width: _dimensions.columns,
            space: _dimensions.scale,
            color: 0x00ff00
        } );
        _grid.add( gridPositions.mesh );
    }

    function _addBorder() {

        console.log( "building grid - _addBorder" );

        const border = new THREE.Object3D();
        const material = new THREE.MeshPhysicalMaterial( { color: 0x0000ff } );


        const borderSideGeometry = new THREE.BoxGeometry( _dimensions.borderThickness, _dimensions.lines * _dimensions.scale + _dimensions.borderThickness );
        const borderTopGeometry = new THREE.BoxGeometry( _dimensions.columns * _dimensions.scale + _dimensions.borderThickness * 2, _dimensions.borderThickness );


        _border.left = new THREE.Mesh( borderSideGeometry, material );
        _border.right = new THREE.Mesh( borderSideGeometry, material );
        _border.top = new THREE.Mesh( borderTopGeometry, material );

        const _sideDisplacement = 0.5 * _dimensions.columns * _dimensions.scale + _dimensions.borderThickness / 2;

        border.add( _border.left );
        _border.left.position.set( _sideDisplacement, 0, 0 );

        border.add( _border.right );
        _border.right.position.set( -_sideDisplacement, 0, 0 );

        const _topDisplacement = 0.5 * _dimensions.lines * _dimensions.scale + _dimensions.borderThickness / 2;

        border.add( _border.top );
        _border.top.position.set( 0, _topDisplacement, 0 );

        _grid.add( border );

    }


    function _addDebugGrid() {

        console.log( "building grid - _addDebugGrid" );

        _grid.add( _debug );
        const gridBackground = _addGridBackgroundPlane();
        _debug.add( gridBackground );

        const gridLines = createGridLines( {
            height: _dimensions.lines,
            width: _dimensions.columns,
            space: _dimensions.scale,
            color: 0x00ff00
        } );
        _debug.add( gridLines );


    }


    const _addGridBackgroundPlane = function () {
        const planeGeometry = new THREE.PlaneGeometry( _dimensions.columns * _dimensions.scale, _dimensions.lines * _dimensions.scale );
        //planeGeometry.rotateX( -Math.PI / 2 );
        const planeMaterial = new THREE.MeshPhongMaterial( {
            opacity: 0.8, transparent: true, depthWrite: false, color: 0xff0000
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
    function createGridLines( opts ) {

        var config = Object.assign( {


            height: 500,
            width: 500,
            space: 10,
            color: 0x0000ff
        }, opts );

        var material = new THREE.LineBasicMaterial( {
            color: config.color,
            opacity: 0.9
        } );

        var gridObject = new THREE.Object3D(),
            gridGeo = new THREE.Geometry(),
            width = config.space * (config.width / 2),
            height = config.space * (config.height / 2),
            step = config.space;

        //width
        for ( var i = -width; i <= width; i += step ) {
            gridGeo.vertices.push( new THREE.Vector3( i, -height, 0 ) );
            gridGeo.vertices.push( new THREE.Vector3( i, height, 0 ) );

        }
        //height
        for ( var i = -height; i <= height; i += step ) {
            gridGeo.vertices.push( new THREE.Vector3( -width, i, 0 ) );
            gridGeo.vertices.push( new THREE.Vector3( width, i, 0 ) );
        }

        var line = new THREE.Line( gridGeo, material, THREE.LinePieces );
        gridObject.add( line );

        return gridObject;
    }

    function createGridPositions( opts ) {

        const config = Object.assign( {


            height: 500,
            width: 500,
            space: 10,
            color: 0x00ff00
        }, opts );


        _gridArray.splice( 0, _gridArray.length );
        const gridObject = new THREE.Object3D(),
            width = config.space * (config.width / 2),
            height = config.space * (config.height / 2),
            step = config.space;


        const gridGeo = new THREE.BoxGeometry( step - 0.1, step - 0.1 );

        //for each line
        for ( let x = -height + step / 2; x <= height - step / 2; x += step ) {
            let _heightArray = [];
            for ( let y = -width + step / 2; y <= width - step / 2; y += step ) {
                const newGridPosition = new GridPosition( gridGeo, config.color );
                _heightArray.push( newGridPosition );
                gridObject.add( newGridPosition.mesh );
                newGridPosition.mesh.position.set( y, x, 0 );
            }
            _gridArray.push( _heightArray );
        }
        console.log( _gridArray );
        // we should have an array with the boxes and they should be on gridObject


        return { mesh: gridObject, array: _gridArray };
    }

    function GridPosition( geometry, color ) {

        const material = new THREE.MeshBasicMaterial( {

            color: color,
            opacity: 0.5,
            transparent: true
        } );
        const _mesh = new THREE.Mesh( geometry, material );
        this.ball = null;
        return {
            get mesh() {
                return _mesh
            },
            activate: ( state, ball )=> {
                this.ball = ball ? ball : null;
                _mesh.material.color = new THREE.Color( this.state[ state ].color );
            },
            set visible( value ) {
                _mesh.material.tranparent = value;
                _mesh.material.opacity = value ? 0.8 : 0.0;
            }
        }

    }

    GridPosition.prototype.state = {
        inactive: { color: 0x0000ff },
        ready: { color: 0x00ff00 },
        trespassing: { color: 0xff0000 },
        occupied: { color: 0x000000 }

    }


    let state = {
        dimensions: _dimensions,
        new: _new,
        set debug( value ) {
            if ( !_debug ) {
                console.log( "debug is not defined" );
                return;
            }

            _gridArray.forEach( ( gridLine )=> {
                gridLine.forEach( ( gridPosition ) => {
                    gridPosition.visible = value;
                } )
            } );

            _debug.visible = value;
        },
        get debug() {
            if ( !_debug ) {
                console.log( "debug is not defined" );
                return _grid;
            }
            return _debug.visible;
        },
        slots: _gridArray,
        border: _border
    };
    console.log( _gridArray );
    return { gridboard: state };
}
