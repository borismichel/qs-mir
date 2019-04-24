import React, { Component } from "react";

import {ExportLineItem} from './ExportLineItem'

export class SavedItemsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            openEls: [],
            baseUrl: '',
            update: true,
            apps: []
        }
        
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.state.baseUrl= uri;

        this.updateList = this.updateList.bind(this);
        this.pushOpenItem = this.pushOpenItem.bind(this);
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
            this.state.apps= options;
            this.updateList();
        })
    }

    updateList() {
        let uri = this.state.baseUrl + '/api/getstoreditemsfortable';

        fetch(uri)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let savedItems = response.map((item, idx) => {
                return (
                        <ExportLineItem 
                            key=        {item.id}
                            name=       {item.name}
                            description={item.description}
                            type=       {item.type}
                            app=        {item.app}
                            appname=    {item.appname}
                            objectid=   {item.objectid}
                            definition= {item.definition}
                            object=     {item.object}
                            line_id=    {item.id}
                            version=    {item.version}
                            allversions={item.allVersions}
                            update=     {this.updateList}
                            apps=       {this.state.apps}
                            line=       {idx}
                            open=       {(this.state.openEls.indexOf(item.app + '/' + item.objectid) > -1) ? true:false}
                            pushOpenItem= {this.pushOpenItem}
                        />
                )
            })
            this.setState({items: savedItems});
        });
    }
    
    pushOpenItem (el) { //tracks open collapses ... yea, great phrasing
        (this.state.openEls.indexOf(el) > -1) ? this.state.openEls.splice(this.state.openEls.indexOf(el), 1): this.state.openEls.push(el);
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

        this.state.baseUrl= uri;

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
                    <button
                        className={this.setBtnClass("btn btn-info")}
                        type="button"
                        title="Export to App"
                        onClick={(this.props.edit) ? null: () => {this.handleSend(this.state.id, 'export', this.state.object)}}
                    >
                        <i className="fas fa-upload" />
                    </button>
                </span>
            </div>
        )
    }
}