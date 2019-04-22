import React, { Component } from "react";

import '../styles/App.css';

export class ImportLineItem extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            type:   this.props.type, 
            app:    this.props.app,
            layout: this.props.layout,
            title:  this.props.title,
            label:  this.props.label,
            desc:   this.props.desc,
            id:     this.props.id,
            def:    this.props.def,
            line:   this.props.line,
            baseUrl: this.props.url,
            version: this.props.version,
            imported: false
        }

        this.handleSend = this.handleSend.bind(this);

    }

    handleSend(object) {
        let sendUrl = this.state.baseUrl + '/api/storeobject'

        console.log('Sending', object)

        fetch(sendUrl, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then((r) => {
            this.setState({imported: true})
        })
    }

    render(){
        var ButtonClass = (this.state.imported) ? "btn disabled":(this.state.version) ? "btn btn-warning":"btn btn-success";
        var ButtonText = (this.state.imported) ? "Imported":(this.state.version) ? "Update to v" + (this.state.version + 1):"Import to Repo";
        var symbol = (this.state.version) ? "fas fa-arrow-alt-circle-up":"fas fa-download"

        return (
            <tr>
                <td>{this.state.line}</td>
                <td>{this.state.title}</td>
                <td>{this.state.label}</td>
                <td>{this.state.desc}</td>
                <td><code>{this.state.def}</code></td>
                <td>
                    <button 
                        className={ButtonClass}
                        type="button"
                        title={ButtonText}
                        onClick={(this.state.imported) ?() => '':() => {this.handleSend(this.state)}}
                        value={ButtonText}
                    >
                     <i className={symbol} />
                    </button>
                </td>
            </tr>
        )
    }
}