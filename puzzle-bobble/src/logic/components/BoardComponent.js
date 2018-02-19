import * as THREE from 'three';

export const isGridBoard = ( parent, parameters ) => {
    let _dimensions = {
        lines: 5,
        columns: 10,
        scale: 2
    };

    let _grid;

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
        _addDebugGrid();
        parent.mesh.add( _grid )

    }

    function _addPositions() {

        console.log( "building grid - _addPositions" );
    }

    function _addDebugGrid() {

        console.log( "building grid - _addDebugGrid" );


        const size = 2000;
        const divisions = 1000;

        const planeGeometry = new THREE.PlaneGeometry( _dimensions.lines * _dimensions.scale, _dimensions.columns * _dimensions.scale );
        //planeGeometry.rotateX( -Math.PI / 2 );
        const planeMaterial = new THREE.MeshPhongMaterial( {
            opacity: 0.8, transparent: true, depthWrite: false, color: 0xff0000
        } );
        const plane = new THREE.Mesh( planeGeometry, planeMaterial );
        //plane.position.y = -0.1;
        plane.receiveShadow = true;
        plane.material.transparent = true;
        plane.renderOrder = 100;
        _grid.add( plane );

        const gridHelper = createAGrid( {
            height: _dimensions.lines,
            width: _dimensions.columns,
            space: _dimensions.scale,
            color: 0x00ff00
        } );
        //gridHelper.castShadow = true;

        _grid.add( gridHelper );

    }

//----------------------------------------------------------------------------
// adapted from :
// https://bocoup.com/blog/learning-three-js-with-real-world-challenges-that-have-already-been-solved
//----------------------------------------------------------------------------
    function createAGrid( opts ) {

        var config = Object.assign( {


            height: 500,
            width: 500,
            space: 10,
            color: 0x00ff00
        }, opts );

        var material = new THREE.LineBasicMaterial( {
            color: config.color,
            opacity: 0.2
        } );

        var gridObject = new THREE.Object3D(),
            gridGeo = new THREE.Geometry(),
            width = config.space * (config.width / 2),
            height = config.space * (config.height / 2),
            step = config.space

        //width
        for ( var i = -width; i <= width; i += step ) {
            gridGeo.vertices.push( new THREE.Vector3( -height, i, 0 ) );
            gridGeo.vertices.push( new THREE.Vector3( height, i, 0 ) );

        }
        //height
        for ( var i = -height; i <= height; i += step ) {
            gridGeo.vertices.push( new THREE.Vector3( i, -width, 0 ) );
            gridGeo.vertices.push( new THREE.Vector3( i, width, 0 ) );
        }

        var line = new THREE.Line( gridGeo, material, THREE.LinePieces );
        gridObject.add( line );

        return gridObject;
    }


    let state = {
        dimensions: _dimensions,
        new: _new,
        set debug( value ) {
            if ( !_grid ) {
                console.log( "debug is not defined" );
                return;
            }
            _grid.visible = value;
        },
        get debug() {
            if ( !_grid ) {
                console.log( "debug is not defined" );
                return _grid;
            }
            return _grid.visible;
        }
    }

    return { gridboard: state };
}

export const hasMeasurePoints = ( possibleSubObjects ) => {

    function MeasurePoint( point1, point2, distanceVector ) {
        this.point1 = point1;
        this.point2 = point2;
        this.distanceVector = distanceVector;
        this.visible = true;
        this.material = new THREE.LineBasicMaterial( { color: this.color } );
        this.geometry = new THREE.Geometry();
        const _halfDistanceVector = distanceVector.clone().normalize().multiplyScalar( 0.2 );
        const _lineBorders = {
            top: [
                point1.clone().add( _halfDistanceVector ),
                point1.clone().sub( _halfDistanceVector )
            ],
            bottom: [
                point2.clone().add( _halfDistanceVector ),
                point2.clone().sub( _halfDistanceVector ) ]
        };
        this.geometry.vertices.push( _lineBorders.top[ 0 ], _lineBorders.top[ 1 ] );
        this.geometry.vertices.push( _lineBorders.bottom[ 0 ], _lineBorders.bottom[ 1 ] );
        this.geometry.vertices.push( point1 );
        this.geometry.vertices.push( point2 );
        this.distanceScalar = point1.distanceTo( point2 );
        this.line = new THREE.LineSegments( this.geometry, this.material );
        this.line.linewidth = 2;
        this.text = null;

    }

    function addMeasurePointPair( point1, point2, distanceVector ) {
        if ( !(point1 instanceof THREE.Vector3) || !(point2 instanceof THREE.Vector3) || !(distanceVector instanceof THREE.Vector3 ) ) {
            return;
        }
        const _measurePoint = new MeasurePoint( point1, point2, distanceVector );
        const loader = new THREE.FontLoader();

        loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

            const geometry = new THREE.TextGeometry( _measurePoint.distanceScalar, {
                font: font,
                size: .5,
                height: 0.01,
                curveSegments: 12
            } );

            _measurePoint.text = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: _measurePoint.color } ) );
            _measurePoint.line.add( _measurePoint.text );
            _measurePoint.text.position.add( point1.lerp( point2, 0.5 ) ).add( distanceVector.clone().normalize().multiplyScalar( 0.5 ) );
            _measurePoint.text.geometry.center();
        } );

        this.measurePoints.push( _measurePoint );
        console.log( this.mesh.parent );
        this.mesh.add( _measurePoint.line );
        _measurePoint.line.position.add( distanceVector ).add( distanceVector.clone().multiplyScalar( this.randomDistance ) );
    }

    let state = {
        measurePoints: [],
        randomDistance: Math.random(),
        addMeasurePointPair: addMeasurePointPair,
        color: '#' + (Math.random() * 0xFFFFFF << 0).toString( 16 )
    };

    return state;

}