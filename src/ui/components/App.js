import React, { Component } from "react";
import * as Utils from './Utils';

import '../styles/App.css';

const myArr = [1, 2, 3, 4, 5, 6]
const myTable=[
    {c1: "SA", c2: "sadada", c3: "dasdasdad"},
    {c1: "asdasdad", c2: "sadada", c3: "dasdasdad"},
    {c1: "AASD", c2: "sadada", c3: "dasdasdad"},
    {c1: "AASD", c2: "sadada", c3: "dasdasdad"},
];
var myArrEL = [];

class App extends Component {
    render() {
        return (
            <div>
                <h1>My React App!</h1>
                <Utils.MyTable rows={myTable} />
                <Utils.MyReactForm />
                <Utils.ItemTable />
            </div>
        );
    }
}


export default App;