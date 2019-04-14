import React, { Component } from "react";

import * as Send from './Send';
import * as View from './View';

import '../styles/App.css';

export class container extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div class="container">
                <View.SavedItemsTable />
                <Send.AppLoader />
            </div>
        )
    }
}