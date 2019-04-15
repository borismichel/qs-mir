import React, { Component } from "react";

import '../styles/App.css';

export class ItemTable extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);

        this.state = {
            measures: [],
            dimensions: [],
            app: '',
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
        if (this.state.app =='') {return};
        let uri = this.state.baseUrl + '/api/qsmasterpull';

        fetch(uri, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({"app": this.state.app})
        })
        .then((response) => {
            return response.json();
        })
        .then(resultArray => {
            let msrArray = resultArray[0].map((msrObj, idx) => {
                let valueObject = {
                    type: 'measure', 
                    app: this.state.app,
                    layout: msrObj.layout,
                    title: msrObj.title,
                    label: msrObj.label,
                    desc: msrObj.desc,
                    id: msrObj.id,
                    def: msrObj.def
                };
                return (
                    <tr>
                        <td class="id">{idx+1}</td>
                        <td class="title">{msrObj.title}</td>
                        <td class="title">{msrObj.label}</td>
                        <td class="title">{msrObj.desc}</td>
                        <td class="long"><code>{msrObj.def}</code></td>
                        <td>
                            <input 
                                class="btn btn-success"
                                type="button"
                                onClick={() => {this.handleSend(valueObject)}}
                                value="Import to Repo"
                            />
                        </td>
                    </tr>
                )
            })
            let dimArray = resultArray[1].map((dimObj, idx) => {
                let valueObject = {
                    type: 'dimension', 
                    app: this.state.app,
                    layout: dimObj.layout,
                    title: dimObj.title,
                    label: dimObj.label,
                    desc: dimObj.desc,
                    id: dimObj.id,
                    def: dimObj.def
                };
                return (
                    <tr>
                        <td class="id">{idx+1}</td>
                        <td class="title">{dimObj.title}</td>
                        <td class="title">{dimObj.label}</td>
                        <td class="title">{dimObj.desc}</td>
                        <td class="long"><code>{dimObj.def}</code></td>
                        <td>
                            <input 
                                class="btn btn-success"
                                type="button"
                                onClick={() => {this.handleSend(valueObject)}}
                                value="Import to Repo"
                            />
                        </td>
                    </tr>
                )
            })
            console.log(dimArray);
            this.setState({
                measures: msrArray,
                dimensions: dimArray
            })
            console.log('State: ', this.state)
        })
    }
    
    render(){
        return (
            <div>
                <h2>Measures</h2>
                <table class="table table-striped">
                    <tbody>
                        <tr>
                            <th class="id">#</th>
                            <th class="title">Name</th>
                            <th class="title">Label</th>
                            <th class="title">Description</th>
                            <th class="long">Definition</th>
                            <th></th>
                        </tr>
                        {this.state.measures}
                    </tbody>
                </table>
                <h2>Dimensions</h2>
                <table class="table table-striped">
                    <tbody>
                        <tr>
                            <th class="id">#</th>
                            <th class="title">Name</th>
                            <th class="title">Label</th>
                            <th class="title">Description</th>
                            <th class="long">Definition</th>
                            <th></th>
                        </tr>
                        {this.state.dimensions}
                    </tbody>
                </table>
            </div>  
        )
    }

}

export class AppLoader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            app: '',
            apps: [],
            selected_app: '',
            value: '<Select App>'
        }
        this.handleChange = this.handleChange.bind(this);
        this.loadAppData = this.loadAppData.bind(this);
    }

    componentWillMount() {        
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';
        uri += '/api/qsgetdoclist';

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
            selected_app: event.target.value,
            value: event.target.text
        })
    }

    loadAppData(){
        this.setState({
            app: this.state.selected_app
        })
    }

    render() {
        console.log(this.state);
        return(
            <div class="panel panel-default">
                <div class="panel-heading">Select an App to View Master Items</div>    
                <div class="panel-body">
                    <div class="input-group app-select">
                        <select 
                            class="form-control"
                            value={this.state.value} 
                            onChange={this.handleChange}>
                            <option value=''>&lt;Select App&gt;</option>
                            {this.state.apps}
                        </select>
                        <span class="input-group-btn">
                            <input 
                                class="btn btn-success"
                                type="button"
                                value="Load"
                                onClick={this.loadAppData}
                            />
                        </span>
                    </div>
                    <ItemTable app={this.state.app} />
                </div>
            </div>
        )
    }
}