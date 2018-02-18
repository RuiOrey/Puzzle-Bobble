import React, {Component} from 'react';
import * as THREE from 'three';

class GameComponent extends Component {

  parentGameObject;

  componentDidMount()
    {
      this.id = this.props.id;
    }

  setParent(parent){
    this.parent = parent;
  }

  _update = () => {
    this.update();
  };

  update = () => {
  };

  render()
    {
      this.i++;
      console.log( 'render {$this.id} i:${this.i}' );
      return null;
    }
}

export default GameObject;