import React, { Component } from "react";

import '../styles/App.css';

export class SavedItemsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            baseUrl: '',
            update: true,
            apps: []
        }
        
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.setState({baseUrl: uri});

        this.updateList = this.updateList.bind(this);
    }

    componentWillReceiveProps(newProps) {   
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillMount(){
        let uri = this.state.baseUrl + '/api/qsgetdoclist';

        fetch(uri)
        .then((list) => {
            return list.json();
        })
        .then((apps) => {
            return apps.map((app, idx) => {
                return (
                    <option key={idx} value={app.qDocId}>{app.qDocName}</option>
                )
            })
        })
        .then((options) => {
            this.setState({
                apps: options
            })
            this.updateList();
        })
    }

    updateList() {
        let uri = this.state.baseUrl + '/api/getstoreditems';

        fetch(uri)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            console.log(response)
            let savedItems = response.map((item, idx) => {
                return (
                        <ItemLine 
                            key=        {item.id}
                            name=       {item.name}
                            description={item.description}
                            type=       {item.type}
                            app=        {item.app}
                            objectid=   {item.objectid}
                            definition= {item.definition}
                            object=     {item.object}
                            line_id=    {item.id}
                            update=     {this.updateList}
                            apps=       {this.state.apps}
                        />
                )
            })
            this.setState({items: savedItems});
        });
    }
    
    render(){
        return (
            <div class="panel panel-default">
                <div class="panel-heading">
                    Saved Items
                </div>
                <div class="panel-body">
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Original App</th>
                                <th>Object Id</th>
                                <th>Definition</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            {this.state.items}
                        </tbody>
                    </table>
                </div>
            </div>  
        )
    }

}

export class AppSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            app: '',
            apps: this.props.apps,
            value: 'App',
            id: this.props.id,
            object: this.props.object, 
            baseUrl : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.setBtnClass = this.setBtnClass.bind(this);

        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.setState({baseUrl: uri});

    }

    componentWillMount() {        
    }

    shouldComponentUpdate() {
        return true;
    }

    handleChange(event){
        this.setState({
            app: event.target.value,
            value: event.target.text
        })
    }    
    
    handleSend(id, method, object) {
        let sendUrl = this.state.baseUrl + '/api/editobject'

        let body = {
            id: id,
            method: method,
            object: object,
            app: this.state.app
        }
        fetch(sendUrl, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }

    setBtnClass(targetClass){
        return (this.props.edit) ? targetClass + ' disabled':targetClass;
    }

    render() {
        return(
            <div class="input-group">         
                <select class={this.setBtnClass("form-control")}
                    value={this.state.value} 
                    onChange={this.handleChange}
                    >
                        <option value=''>App</option>
                        {this.state.apps}
                </select>
                <span class="input-group-btn">
                    <input
                        class={this.setBtnClass("btn btn-info")}
                        type="button"
                        value="Export"
                        onClick={(this.props.edit) ? '': () => {this.handleSend(this.state.id, 'export', this.state.object)}}
                    />
                </span>
            </div>
        )
    }
}

export class ItemLine extends Component {
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
                jsx = <textarea>{text}</textarea>
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
            <tr>
                <td><b>{this.setTdOrInput('input', this.state.name)}</b></td>
                <td>{this.setTdOrInput('textarea',this.state.description)}</td>
                <td>{this.state.type}</td>
                <td>{this.state.app}</td>
                <td>{this.state.objectid}</td>
                <td><code>{this.setTdOrInput('textarea', this.state.definition)}</code></td>
                <td>
                    <button
                        class={this.toggleBtnClass()}
                        type="button"
                        value="X"
                        title="Edit Item"
                        onClick={this.handleEdit}
                    >
                        <i class="fas fa-pencil-alt" />
                    </button>
                </td>
                <td>
                    <button
                        class={this.setBtnClass("btn btn-danger")}
                        type="button"
                        value="X"
                        title="Delete Item"
                        onClick={(this.state.edit) ? '':() =>{this.handleSend(this.state.id, 'delete')}}
                    >
                        <i class="fas fa-trash-alt" />
                    </button>
                </td>
                <td>
                    <button
                        class={this.setBtnClass("btn btn-warning")}
                        type="button"
                        value="x2"
                        title="Duplicate Item"
                        onClick={(this.state.edit) ? '':() => {this.handleSend(this.state.id, 'duplicate')}}
                    >
                        <i class="fas fa-angle-double-right" />
                    </button>
                </td>
                <td>
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