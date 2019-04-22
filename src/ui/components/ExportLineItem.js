import React, { Component } from "react";
import Collapse from "react-bootstrap/Collapse"
import {AppSelector} from './View'

export class ExportLineItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.line_id,
            name: this.props.name,
            type: this.props.type,
            app: this.props.app,
            objectid: this.props.objectid,
            definition: this.props.definition,
            object: this.props.object,
            line: this.props.line,
            open: false,

            edit: false,

            baseUrl: ''
        }
        this.handleSend = this.handleSend.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.setTdOrInput = this.setTdOrInput.bind(this);
        this.setBtnClass = this.setBtnClass.bind(this);
        this.toggleBtnClass = this.toggleBtnClass.bind(this);

        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.setState({baseUrl: uri});
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
            console.log('Update')
            this.props.update();
        })
    }

    handleEdit() {
        console.log('Editing')
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
                jsx = <input value={text} />
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

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <table><tbody><tr>
                        <td className="name">
                            <a href={"#item" + this.state.line}onClick={() => this.setState({open: !this.state.open})}>
                                <b>
                                        {this.setTdOrInput('input', this.state.name)}
                                </b>
                            </a>
                        </td>
                        {/* <td className="description">{this.setTdOrInput('input',this.state.description)}</td> */}
                        <td className="type">{this.state.type}</td>
                        <td className="app">{this.state.app}</td>
                        {/* <td className="objectid">{this.state.objectid}</td> */}
                        {/* <td className="definition"><code>{this.setTdOrInput('textarea', this.state.definition)}</code></td> */}
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
                                onClick={(this.state.edit) ? '':() =>{this.handleSend(this.state.id, 'delete')}}
                            >
                                <i className="fas fa-trash-alt" />
                            </button>
                        </td>
                        <td className="single-button">
                            <button
                                className={this.setBtnClass("btn btn-warning")}
                                type="button"
                                value="x2"
                                title="Duplicate Item"
                                onClick={(this.state.edit) ? '':() => {this.handleSend(this.state.id, 'duplicate')}}
                            >
                                <i className="fas fa-clone" />
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
                    </tr></tbody></table>
                </div>
                <Collapse in={this.state.open}>
                    <div id={'item' + this.state.line}>
                        <div className="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}