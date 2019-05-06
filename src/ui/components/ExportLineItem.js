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

            sublines: null,
            update: false,

            baseUrl: ''
        }
        this.handleSend = this.handleSend.bind(this);
        this.handleOpenToggle = this.handleOpenToggle.bind(this);
        this.updateList = this.updateList.bind(this);
        this.buildSubLines = this.buildSubLines.bind(this);

        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.state.baseUrl= uri
    }

    componentWillMount() {
        //Populate list
        this.buildSubLines(this.props.allversions);
    }
    
    componentWillReceiveProps(newProps) {
        this.buildSubLines(newProps.allversions)
        this.setState({
            id: newProps.line_id,
            name: newProps.name,
            type: newProps.type,
            app: newProps.app,
            appname: newProps.appname,
            objectid: newProps.objectid,
            definition: newProps.definition,
            description: newProps.description,
            object: newProps.object,
            line: newProps.line,
            version: newProps.version,
            allv: newProps.allversions
        })
    }

    shouldComponentUpdate(){
        return true;
    }

    updateList() {
        this.props.update();
    }

    buildSubLines(list) {
        let versionList =list.map((obj, idx) => {
            return(
                <ExportSubLine
                    key={obj.id}
                    version= {obj.version}
                    name= {obj.name}
                    label= {obj.label}
                    definition= {obj.definition}
                    description= {obj.description}
                    object= {obj.object}
                    id= {obj.id}                
                    type={obj.type}    
                    apps={this.props.apps}

                    update={this.updateList}
                />
            )
        })
        this.state.sublines = versionList;
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
                            <a href={"#"} onClick={this.handleOpenToggle}>
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
                                    {this.state.sublines}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}
