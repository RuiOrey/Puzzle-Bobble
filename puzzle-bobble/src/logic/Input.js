import React, { Component } from 'react';

export class Input extends Component {

    events: {
        "ArrowLeft":"moveleft",
        "ArrowUp": "moveright"
    };

    componentDidMount() {

        const moveleft = new Event('moveleft');
        const moveright = new Event('moveright');
        const shoot = new Event('shoot');

        document.addEventListener('keydown', function(event) {
            console.log("Pressed: ", event.keyCode);

            if (event.key === "ArrowLeft") {
                document.dispatchEvent(moveleft, false);
            }

            if (event.key === "ArrowRight") {
                document.dispatchEvent(moveright, false);
            }

            if (event.keyCode === 32) {
                document.dispatchEvent(shoot, false);
            }
        });
    }

    render() {
        return null
    }

}