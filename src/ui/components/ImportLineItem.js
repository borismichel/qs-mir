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
        var addButtonClass = (this.state.imported) ? "btn disabled":"btn btn-success";
        var addButtonText = (this.state.imported) ? "Imported":"Import to Repo";
        var upButtonClass = (this.state.imported||!this.state.version) ? "btn disabled":"btn btn-warning";
        var upButtonText = (this.state.imported) ? "Imported":"Update current Version";
        var currentVersion = (this.state.version) ? "Prev. v" + this.state.version:'New Import';

        return (
            <tr>
                <td>{this.state.line}</td>
                <td>{this.state.title}</td>
                <td>{this.state.label}</td>
                <td>{this.state.desc}</td>
                <td><code>{this.state.def}</code></td>
                <td>
                    <button 
                        className={addButtonClass}
                        type="button"
                        title={addButtonText}
                        onClick={(this.state.imported) ?'':() => {this.handleSend(this.state)}}
                        value={addButtonText}
                    >
                     <i className="fas fa-download" />
                    </button>
                </td>
                <td>
                    <button 
                        className={upButtonClass}
                        type="button"
                        title={upButtonText}
                        onClick={(this.state.imported) ?'':() => {this.handleSend(this.state)}}
                        value={upButtonText}
                    >
                     <i className="fas fa-arrow-alt-circle-up" />
                    </button>
                </td>
                <td>{currentVersion}</td>
            </tr>
        )
    }
}