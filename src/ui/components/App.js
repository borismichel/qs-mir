import React, { Component } from "react";
import * as Utils from './Utils';

import '../styles/App.css';

class App extends Component {
    render() {
        return (
            <div>
                <h1>QS MIR</h1>
                <Utils.AppDropDown />
            </div>
        );
    }
}


export default App;