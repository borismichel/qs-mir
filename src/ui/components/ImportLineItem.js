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
            this.setState({imported: this.state.imported + " disabled"})
        })
    }

    render(){
        var buttonClass = (this.state.imported) ? "btn disabled":"btn btn-success";
        var buttonText = (this.state.imported) ? "Imported":"Import to Repo";
        return (
            <tr>
                <td class="id">{this.state.line}</td>
                <td class="title">{this.state.title}</td>
                <td class="title">{this.state.label}</td>
                <td class="title">{this.state.desc}</td>
                <td class="long"><code>{this.state.def}</code></td>
                <td>
                    <input 
                        class={buttonClass}
                        type="button"
                        onClick={(this.state.imported) ?'':() => {this.handleSend(this.state)}}
                        value={buttonText}
                    />
                </td>
            </tr>
        )
    }
}