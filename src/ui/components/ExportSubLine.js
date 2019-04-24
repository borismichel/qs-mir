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

            update: false,
            modal: false
        }

        this.handleSend = this.handleSend.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        
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
            this.setState({update: !this.state.update});
            this.modal && this.setState({modal: false}); //Close Modal if send came from inside Modal
            this.props.update();
        })
    }

    toggleEdit() {
        this.setState({modal: !this.state.modal})
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
                    <h2>Edit <b>{this.state.name}</b></h2>
                    <h4>Version {this.state.version}</h4>
                    <table className="table"><tbody>
                    <tr>
                        <td style={{textAlign: 'right'}}><b>Name</b></td>
                        <td><input className="form-control" value={this.state.name} /></td>
                    </tr>
                    <tr>
                        <td style={{textAlign: 'right'}}><b>Label</b></td>
                        <td><input className="form-control" value={this.state.label} /></td>
                    </tr>
                    <tr>
                        <td style={{textAlign: 'right'}}><b>Description</b></td>
                        <td><textarea className="form-control" cols="50" rows="5" >{this.state.description}</textarea></td>
                    </tr>
                    <tr>
                        <td style={{textAlign: 'right'}}><b>Definition</b></td>
                        <td><code><textarea className="form-control" cols="50" rows="15" >{this.state.definition}</textarea></code></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style={{textAlign:'center'}}>
                            <button className="btn btn-success" onClick={() => this.setState({modal: false})}><i class="fas fa-check"></i></button> 
                            <span>     </span>                                            
                            <button className="btn btn-danger" onClick={() => this.setState({modal: false})}><i class="fas fa-times"></i></button>
                        </td>
                    </tr>
                    </tbody></table>   
                </Modal>
            </tr>
        )
    }
}