import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import {PuzzleBobble} from './application/PuzzleBobble/PuzzleBobble';

class App extends Component {
  render()
    {
      return (
          <div className="App">
            <header className="App-header">
              {/*<img src={logo} className="App-logo" alt="logo"/>*/}
              
              <h1 className="App-title">Puzzle Bobble 3D WebGL</h1>

              <p>by Rui d'Orey</p>
              <p>keys: [c] - change camera [space] - shoot [arrow left & right]
                 - change shooter orientation</p>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
            <PuzzleBobble></PuzzleBobble>
          </div>
      );
    }
}

export default App;
