import React, {Component} from 'react';
import {GameObject} from '../GameObject';

import {isTraveler} from '../components/TravelerComponent';
import {isBall} from '../components/BallComponent';

class BallPrefab extends GameObject {

  buildComponents = () => {
    this.parameters = this.props.parameters ? this.props.parameters : {};
    this.parameters = Object.assign( {ball: {}}, this.parameters );
    Object.assign( this.components, isBall( this, this.parameters.ball ) );
    Object.assign( this, isTraveler( this.mesh ) );
  };

  render()
    {
      return null;
    }
}

export default BallPrefab;