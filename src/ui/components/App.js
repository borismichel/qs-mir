import React, { Component } from "react";

import * as Body from './Body';

import '../styles/App.css';

class App extends Component {
    render() {
        return (
            <div>
                <h1>QS MIR</h1>
                <Body.container />
            </div>
        );
    }
}


export default App;