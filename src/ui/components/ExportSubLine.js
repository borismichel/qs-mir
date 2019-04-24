import React, { Component } from "react";
import {AppSelector} from './View'

export class ExportSubLine extends Component {
    constructor(props) {
        super(props);

        this.state={
            
            id: this.props.id,
            version: this.props.version,
            name: this.props.name,
            label: this.props.label,
            definition: this.props.definition,
            description: this.props.definition,
            object: this.props.object,

            edit: false,
            update: false
        }
        this.handleSend = this.handleSend.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.setTdOrInput = this.setTdOrInput.bind(this);
        this.setBtnClass = this.setBtnClass.bind(this);
        this.toggleBtnClass = this.toggleBtnClass.bind(this);
        
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.state.baseUrl= uri
    }

    shouldComponentUpdate(){
        return true;
    }

    handleSend(id, method, object) {
        let sendUrl = this.state.baseUrl + '/api/editobject'

        let body = {
            id: id,
            method: method,
            object: object
        }

        fetch(sendUrl, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(() => {
            this.setState({update: !this.state.update})
            this.props.update();
        })
    }

    handleEdit() {
        this.setState({edit: !this.state.edit})
    }

    setTdOrInput(type, text){
        if (this.state.edit) {
            var jsx='';
            switch(type) {
                case 'textarea':
                let rows = (text) ? (text.length/50):1;
                jsx = <textarea cols="50" rows={rows}>{text}</textarea>
                break;

                case 'input':
                jsx = <input style={{display: 'table-cell%'}} value={text} />
                break;
            }
            return jsx;
        } else {
            return (
                text
            )
        }
    }

    setBtnClass(targetClass){
        return (this.state.edit) ? targetClass + ' disabled':targetClass;
    }

    toggleBtnClass() {
        return (this.state.edit) ? "btn btn-success":"btn btn-info"
    }


    render(){
        return (
            <tr>
                <td className="id"><b>v{this.state.version}</b></td>
                <td className="name">{this.setTdOrInput('input', this.state.name)}</td>
                <td className="name">{this.setTdOrInput('input', this.state.label)}</td>
                <td className="definition"><code>{this.state.definition}</code></td>
                
                <td className="single-button">
                        <button
                            className={this.toggleBtnClass()}
                            type="button"
                            value="X"
                            title="Edit Item"
                            onClick={this.handleEdit}
                        >
                            <i className="fas fa-pencil-alt" />
                        </button>
                </td>
                <td className="single-button">
                    <button
                        className={this.setBtnClass("btn btn-danger")}
                        type="button"
                        value="X"
                        title="Delete Item"
                        onClick={(this.state.edit) ? null:() =>{this.handleSend(this.state.id, 'delete')}}
                    >
                        <i className="fas fa-trash-alt" />
                    </button>
                </td>
                <td className="form-app-select">
                    <AppSelector 
                        object={this.state.object}
                        id={this.state.id}
                        apps={this.props.apps}
                        edit={this.state.edit}
                    />
                </td>
            </tr>
        )
    }
}