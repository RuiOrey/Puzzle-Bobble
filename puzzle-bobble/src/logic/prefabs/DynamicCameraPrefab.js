import React from 'react';
import { Camera } from '../../render/Camera';
import { isTraveler } from "../components/TravelerComponent";

export class DynamicCameraPrefab extends Camera {

    componentDidMount() {
        super.componentDidMount();
        Object.assign( this, isTraveler( this.mesh ) );
    }

    render() {
        return <div>DynamicCameraPrefab</div>;
    }
}
