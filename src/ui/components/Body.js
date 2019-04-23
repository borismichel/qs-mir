import React, { Component } from "react";

import * as Send from './Send';
import * as View from './View';

export class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showView: false,
            qlikAlive: false
        }

        this.toggleView = this.toggleView.bind(this);        
    }

    componentDidMount() {
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        fetch(uri + '/api/qlikalive')
        .then((r) => {
            console.log(r)
            return r.json()
        })
        .then((r) => {
            console.log(r)
            if (r.status=='Success') {
                this.setState({qlikAlive: true})
            }
        })
    }

    toggleView() {
        this.setState({showView: !this.state.showView})
    }

    render() {
        let showElement = (this.state.showView) ? <View.SavedItemsTable /> : <Send.AppLoader />
        let buttonText = (!this.state.showView) ? 'Show Master Item Repository':'Browse Apps for Master Items';
        if(this.state.qlikAlive){
            return (
                <div className="container">
                    <div className="panel panel-default">
                    <div className="panel-heading">Toggle Export Import</div>
                    <div className="panel-body text-center">
                        <input 
                            className="btn btn-success"
                            type="button"
                            value={buttonText}
                            onClick={this.toggleView}
                        />            
                    </div>
                    </div>
                        {showElement}
                </div>
            )
        } else {
            return (
                <div className="container-fluid" style={{width: "33%"}}>
                    <div className="panel panel-danger">
                        <div className="panel-heading">No Qlik Session Found!</div>
                        <div className="panel-body text-center">
                            Make Sure your Qlik Sense is running or check the config file of QS MIR
                        </div>     
                    </div>     
                </div>
            )
        }
    }
}