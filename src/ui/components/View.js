import React, { Component } from "react";

import '../styles/App.css';
import { AppLoader } from "./Send";

export class SavedItemsTable extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);

        this.state = {
            items: [],
            baseUrl: '',
            update: true
        }
        
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.setState({baseUrl: uri});

        this.updateList = this.updateList.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }

    componentWillReceiveProps(newProps) {
        console.log('New Props: ', newProps.app)
        this.setState({
            measures:[],
            dimensions: [],
            app: newProps.app
        }, (r) => {
            console.log('My new State: ', this.state)
            this.updateList();
        })
        
        
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillMount(){
        this.updateList();
    }

    handleSend(id, method, object) {
        let sendUrl = this.state.baseUrl + '/api/editobject'

        let body = {
            id: id,
            method: method,
            object: object
        }

        console.log(body)

        fetch(sendUrl, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(() => {
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
                    <tr>
                        <td>{item.objectid}</td>
                        <td>{item.type}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td><code>{item.definition}</code></td>
                        <td>
                            <input
                                class="btn btn-danger"
                                type="button"
                                value="Delete"
                                onClick={() => {this.handleSend(item.id, 'delete')}}
                            />
                        </td>
                        <td>
                            <input
                                class="btn btn-warning"
                                type="button"
                                value="Duplicate"
                                onClick={() => {this.handleSend(item.id, 'duplicate')}}
                            />
                        </td>
                        <td>
                            <AppSelector 
                                object={item.object}
                                id={item.id}
                            />
                        </td>
                    </tr>
                )
            })
            this.setState({items: savedItems});
        });
    }
    
    render(){
        return (
            <div>
                <h2>Measures</h2>
                <table class="table table-striped">
                    <tbody>
                        <tr>
                            <th>Object Id</th>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Description</th>
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
        )
    }

}

export class AppSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            app: '',
            apps: [],
            value: '<Select App>',
            id: this.props.id,
            object: this.props.object, 
            baseUrl : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSend = this.handleSend.bind(this);

        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.setState({baseUrl: uri});

    }

    componentWillMount() {        
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
        })
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

        console.log(body)

        fetch(sendUrl, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(() => {
            // this.updateList();
        })
    }

    render() {
        console.log(this.state);
        return(
            <div>                
                <form>
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value=''>&lt;Select App&gt;</option>
                        {this.state.apps}
                    </select>
                    <input
                        class="btn btn-info"
                        type="button"
                        value="Export"
                        onClick={() => {this.handleSend(this.state.id, 'export', this.state.object)}}
                    />
                </form>
            </div>
        )
    }
}
