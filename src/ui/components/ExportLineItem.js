import React, { Component } from "react";
import Collapse from "react-bootstrap/Collapse"
import {AppSelector} from './View'
import {ExportSubLine} from './ExportSubLine'

export class ExportLineItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.line_id,
            name: this.props.name,
            type: this.props.type,
            app: this.props.app,
            appname: this.props.appname,
            objectid: this.props.objectid,
            definition: this.props.definition,
            description: this.props.description,
            object: this.props.object,
            line: this.props.line,
            version: this.props.version,
            allv: this.props.allversions,
            open: this.props.open,

            update: false,

            baseUrl: ''
        }
        this.handleSend = this.handleSend.bind(this);
        this.handleOpenToggle = this.handleOpenToggle.bind(this);

        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.state.baseUrl= uri
    }

    componentWillMount() {
        //Populate list
        let versionList = this.state.allv.map((obj, idx) => {
            return(
                <ExportSubLine
                    version= {obj.version}
                    name= {obj.name}
                    label= {obj.label}
                    definition= {obj.definition}
                    description= {obj.description}
                    object= {obj.object}
                    id= {obj.id}                    
                    apps={this.props.apps}

                    update={this.props.update}
                />
            )
        })
        this.state.allv = versionList;
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

    handleOpenToggle() {
        this.setState({open: !this.state.open});
        this.props.pushOpenItem(this.state.app + '/' + this.state.objectid)
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <table><tbody><tr>
                        <td className="name">
                            <a href={"#item" + this.state.line} onClick={this.handleOpenToggle}>
                                <b>
                                        {this.state.name}
                                </b>
                            </a>
                        </td>
                        <td className="type">current: v{this.state.version}</td>
                        <td className="type">{this.state.type}</td>
                        <td className="app">{this.state.appname}</td>
                        <td className="single-button">
                            <button
                                className="btn btn-warning"
                                type="button"
                                value="x2"
                                title="Duplicate Current Item Version"
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
                        <div className="panel-body">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th className="id"></th>
                                        <th className="name">Name</th>
                                        <th className="name">Label</th>
                                        <th className="description">Description</th>
                                        <th className="definition">Definition</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                        <th>Export</th>
                                    </tr>
                                    {this.state.allv}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}
