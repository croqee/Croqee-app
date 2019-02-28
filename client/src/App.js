import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CanvasPage from "./containers/CanvasPage"
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
