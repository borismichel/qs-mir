import React, { Component } from "react";
import {AppSelector} from './View'
import Modal from 'react-modal';

//Modal Settings for Editing Master Items

const modalOverlayStyle = {
    zIndex: 9999,
    background: 'rgba(0, 0, 0, 0.75)'
}

const modalContentStyle = {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
}

Modal.setAppElement('#root');

//Sub Line Component

export class ExportSubLine extends Component {
    constructor(props) {
        super(props);

        this.state={
            
            id: this.props.id,
            version: this.props.version,
            name: this.props.name,
            label: this.props.label,
            definition: this.props.definition,
            description: this.props.description,
            object: this.props.object,
            type: this.props.type,

            newName: this.props.name,
            newLabel: this.props.label,
            newDefinition: this.props.definition,
            newDescription: this.props.description,

            update: false,
            modal: false
        }

        this.handleSend = this.handleSend.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleChangeDefinition = this.handleChangeDefinition.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeLabel = this.handleChangeLabel.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.commitChange = this.commitChange.bind(this);
        
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.state.baseUrl= uri
    }

    componentWillReceiveProps(newProps) {

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
            this.props.update();
            // this.setState({update: !this.state.update});
            this.modal && this.setState({modal: false}); //Close Modal if send came from inside Modal
        })
    }

    toggleEdit() {
        this.setState({modal: !this.state.modal})
    }

    handleChangeName(e) {
        this.setState({
            newName: e.target.value
        })
    }

    handleChangeLabel(e) {
        this.setState({
            newLabel: e.target.value
        })
    }

    handleChangeDescription(e) {
        this.setState({
            newDescription: e.target.value
        })
    }

    handleChangeDefinition(e) {
        this.setState({
            newDefinition: e.target.value
        })
    }

    commitChange() {
        // commit new values to current component

        this.setState({
            name: this.state.newName,
            label: this.state.newLabel,
            definition: this.state.newDefinition,
            description: this.state.newDescription,
            modal: false
        })

        // Update Object
        
        let tmpObj = JSON.parse(this.state.object);
        if (this.state.type === 'measure') {
            tmpObj.qMeasure.qDef = this.state.newDefinition;
            tmpObj.qMeasure.qLabel = this.state.newLabel;
        } else {
            tmpObj.qDim.qFieldDefs[0] = this.state.newDefinition;
            tmpObj.qDim.qFieldLabels[0] = this.state.newLabel;
        }
        tmpObj.qMeta.title = this.state.newTitle
        tmpObj.qMeta.description = this.state.newDescription + '\n\n\n modified by QS MIR';

        this.state.object = JSON.stringify(tmpObj);

        // Update in Database

        let sendUrl = this.state.baseUrl + '/api/updateobject'

        let body = {
            id: this.state.id,
            name: this.state.newName,
            label: this.state.newName,
            definition: this.state.newDefinition,
            description: this.state.newDescription,
            object: this.state.object
        }

        fetch(sendUrl, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(() => {
            this.props.update();
            // this.setState({update: !this.state.update})s
        })

    }

    render(){
        return (
            <tr>
                <td className="id"><b>v{this.state.version}</b></td>
                <td className="name">{this.state.name}</td>
                <td className="name">{this.state.label}</td>
                <td className="description" style={{width: (this.state.definition) ? '25%':'0%'}}>{this.state.description}</td>
                <td className="definition"><code>{this.state.definition}</code></td>
                
                <td className="single-button">
                    <button
                        className="btn btn-info"
                        type="button"
                        value="X"
                        title="Edit Item"
                        onClick={this.toggleEdit}
                    >
                        <i className="fas fa-pencil-alt" />
                    </button>
                </td>
                <td className="single-button">
                    <button
                        className="btn btn-danger"
                        type="button"
                        value="X"
                        title="Delete Item"
                        onClick={() =>{this.handleSend(this.state.id, 'delete')}}
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
                <Modal 
                    isOpen={this.state.modal}
                    style={{overlay: modalOverlayStyle, content: modalContentStyle}}
                >
                    <div style={{   margin:10, 
                                    padding:20, 
                                    border: 'solid', 
                                    borderWidth: 1, 
                                    borderColor: 'lightgrey', 
                                    borderRadius: 5,
                                    textAlign: 'center'
                                }}
                    >
                        <h2>Edit <b>{this.state.name}</b></h2>
                        <h4>Version {this.state.version}</h4>
                        <table className="table"><tbody>
                        <tr>
                            <td style={{textAlign: 'right'}}><b>Name</b></td>
                            <td><input className="form-control" value={this.state.newName} onChange={this.handleChangeName} /></td>
                        </tr>
                        <tr>
                            <td style={{textAlign: 'right'}}><b>Label</b></td>
                            <td><input className="form-control" value={this.state.newLabel} onChange={this.handleChangeLabel} /></td>
                        </tr>
                        <tr>
                            <td style={{textAlign: 'right'}}><b>Description</b></td>
                            <td><textarea className="form-control" cols="50" rows="5"  value={this.state.newDescription} onChange={this.handleChangeDescription} /></td>
                        </tr>
                        <tr>
                            <td style={{textAlign: 'right'}}><b>Definition</b></td>
                            <td><code><textarea className="form-control" cols="50" rows="15" value={this.state.newDefinition} onChange={this.handleChangeDefinition} /></code></td>
                        </tr>
                        </tbody></table>   
                        
                        <button className="btn btn-success" onClick={this.commitChange}><i className="fas fa-check"></i> Save</button> 
                        <span>     </span>                                            
                        <button className="btn btn-danger" onClick={() => this.setState({modal: false})}><i className="fas fa-times"></i> Discard</button>
                    </div>
                </Modal>
            </tr>
        )
    }
}