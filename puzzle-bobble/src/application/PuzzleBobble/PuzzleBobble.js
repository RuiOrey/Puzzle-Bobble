import React, { Component } from 'react';
import { Renderer } from "../../render/Renderer";
import { Input } from "../../logic/Input";
import { CollisionManager } from "../../logic/CollisionManager";

export class PuzzleBobble extends Component {
    render() {
        return <div><Renderer></Renderer><Input></Input><CollisionManager></CollisionManager> </div>;
    }
}

export default PuzzleBobble;