import React, { Component } from "react";

import {ExportLineItem} from './ExportLineItem'

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
                        <ExportLineItem 
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
                            line=       {idx}
                        />
                )
            })
            this.setState({items: savedItems});
        });
    }
    
    render(){
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    Saved Items
                </div>
                <div className="panel-body">
                    {this.state.items}
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
            <div className="input-group">         
                <select className={this.setBtnClass("form-control")}
                    value={this.state.value} 
                    onChange={this.handleChange}
                    >
                        <option value=''>App</option>
                        {this.state.apps}
                </select>
                <span className="input-group-btn">
                    <input
                        className={this.setBtnClass("btn btn-info")}
                        type="button"
                        value="Export"
                        onClick={(this.props.edit) ? '': () => {this.handleSend(this.state.id, 'export', this.state.object)}}
                    />
                </span>
            </div>
        )
    }
}