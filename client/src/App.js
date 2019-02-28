import React, { Component } from 'react';
import './App.css';
import CanvasPage from "./components/canvas/CanvasPage"
class App extends Component {
  render() {
    return (
      <div className="App">
        <CanvasPage/>
      </div>
    );
  }
}

export default App;
