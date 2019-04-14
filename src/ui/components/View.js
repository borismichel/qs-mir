import React, { Component } from "react";

import '../styles/App.css';

export class SavedItemsTable extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);

        this.state = {
            items: [],
            baseUrl: ''
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

    handleSend(object) {
        let sendUrl = this.state.baseUrl + '/api/storeobject'

        console.log('Sending', object)

        fetch(sendUrl, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
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
                        <td>{item.type}</td>
                        <td>{item.name}</td>
                        <td>{item.label}</td>
                        <td>{item.description}</td>
                        <td><code>{item.definition}</code></td>
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
                            <th>Type</th>
                            <th>Name</th>
                            <th>Label</th>
                            <th>Description</th>
                            <th>Definition</th>
                            <th></th>
                        </tr>
                        {this.state.items}
                    </tbody>
                </table>
            </div>  
        )
    }

}
