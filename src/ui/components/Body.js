import React, { Component } from "react";

import * as Send from './Send';
import * as View from './View';

export class container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showView: false
        }

        this.toggleView = this.toggleView.bind(this);
    }

    toggleView() {
        this.setState({showView: !this.state.showView})
    }

    render() {
        let showElement = (this.state.showView) ? <View.SavedItemsTable /> : <Send.AppLoader />
        let buttonText = (!this.state.showView) ? 'Show Master Item Repository':'Browse Apps for Master Items';
        return (
            <div class="container-fluid">
            <div class="panel panel-default">
            <div class="panel-heading">Toggle Export Import</div>
            <div class="panel-body text-center">
                <input 
                    class="btn btn-success"
                    type="button"
                    value={buttonText}
                    onClick={this.toggleView}
                />            
            </div>
            </div>
                {showElement}
            </div>
        )
    }
}