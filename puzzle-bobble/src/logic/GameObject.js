import React, {Component} from 'react';
import * as THREE from 'three';

class GameObject extends Component {

  pivot = new THREE.Object3D();
  childComponents = [];
  childGameObjects = [];
  id = '';
  i = 0;

  componentDidMount()
    {
      this.id = this.props.id;
    }

  _update = () => {
    this.childComponents.forEach( ( component ) => {
      component._update();
    } );

    this.childGameObjects.forEach( ( gameobject ) => {
      gameobject._update();
    } );
    this.update();
  };

  update = () => {
  };

  buildChildren = ( children ) => {
    const _children = [];
    if ( !children )
      {
        console.log( 'GameObject ${this.id} has no children to build.' );
      }
    this.childComponents = this.buildChildComponents( children.components );
    this.childGameObjects = this.buildChildGameObjects( children.gameobjects );
  };

  buildChildGameObjects = ( children ) => {

  };

  buildChildComponents = ( children ) => {

  };

  render()
    {
      this.i++;
      console.log( 'render i:${this.i}' );
      return null;
    }

  /*+
    {
            let result: any[] = []
            let DynamicComponentType: typeof Component3D | undefined;

            if ( this.props.elementData.components )
                {
                    Object.keys( this.props.elementData.components ).forEach( componentName => {
                        DynamicComponentType = this.getTypeOfComponent( componentName );

                        if ( !DynamicComponentType )
                            {
                                return;
                            }

                        const _id = this.id + '_component_' + componentName;
                        const _parameters = this.props.elementData.components[ componentName ];
                        result.push( <DynamicComponentType getLogger={this.props.getLogger}
                                                           isSelected={this.state.selected} key={_id} id={_id}
                                                           entity={this} parameters={_parameters}
                                                           geometryWasUpdated={this.state.geometryWasUpdated}
                                                           updateComponentState={this.props.updateComponentState}
                                                           batchUpdateEntityStore={this.props.batchUpdateEntityStore}
                                                           setRendererState={this.props.setRendererState}
                                                           getRendererState={this.props.getRendererState}
                                                           markGeometryAsNeedingUpdate={
                                                               this._markGeometryAsNeedingUpdate}
                                                           registerComponent={this.registerComponent}
                                                           deregisterComponent={this.deregisterComponent}
                                                           getEntityPivotMesh={this.getPivotMesh}
                                                           entityTransformWasUpdated={
                                                               this.updatedTransform}
                                                           attachMeshComponent={this.attachMeshComponent}/> );
                    } );

                }
            let childReactComponents: any[] = [];
            childReactComponents = this.buildChildrenReactComponents( this.props.elementData.id );
            result.push( ...childReactComponents );
            return <div key={this.id}>{result}</div>;
        }
        */

}

export default GameObject;