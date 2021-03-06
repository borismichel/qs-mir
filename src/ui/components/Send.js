import React, { Component } from "react";
import { ImportLineItem } from "./ImportLineItem";
import Modal from "react-modal";

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

export class ItemTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            measures: [],
            dimensions: [],
            app: '',
            app_name: '',
            baseUrl: '',
            load_modal: false
        }
        
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';

        this.state.baseUrl= uri;

        this.updateList = this.updateList.bind(this);
    }

    componentWillReceiveProps(newProps) {
        let fetchNew = newProps.app!==this.state.app; //If I knew what I was doing, this would be redundant?!
        this.setState({
            app: newProps.app,
            app_name: newProps.app_name
        }, () =>  {
            if (fetchNew) {
                this.setState({
                    measures:[],
                    dimensions: []
                }, () => this.updateList()
                );
            }
        })               
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillMount(){
    }

    updateList() {
        if (this.state.app =='') {return};
        let uri = this.state.baseUrl + '/api/qsmasterpull';
        this.setState({load_modal: true});
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
                return (
                    <ImportLineItem 
                        type=   'measure'
                        app=    {this.state.app}
                        app_name={this.state.app_name}
                        layout= {msrObj.layout}
                        title=  {msrObj.title}
                        label=  {msrObj.label}
                        desc=   {msrObj.desc}
                        id=     {msrObj.id}
                        def=    {msrObj.def}
                        line=   {idx+1}
                        version= {msrObj.version}
                        url=    {this.state.baseUrl}
                    />
                )
            })
            let dimArray = resultArray[1].map((dimObj, idx) => {
                return (
                    <ImportLineItem 
                        type=   'dimension'
                        app=    {this.state.app}
                        app_name={this.state.app_name}
                        layout= {dimObj.layout}
                        title=  {dimObj.title}
                        label=  {dimObj.label}
                        desc=   {dimObj.desc}
                        id=     {dimObj.id}
                        def=    {dimObj.def}
                        line=   {idx+1}
                        version= {dimObj.version}
                        url=    {this.state.baseUrl}
                    />
                )
            })
            this.setState({
                measures: msrArray,
                dimensions: dimArray,
                load_modal: false
            })
        })
    }
    
    render(){
        return (
            <div>
                <h2>Measures</h2>
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th className="id">#</th>
                            <th className="title">Name</th>
                            <th className="title">Label</th>
                            <th className="title">Description</th> 
                            {/* {/* <th className="long">Definition</th> */}
                            <th></th>
                        </tr>
                        {this.state.measures}
                    </tbody>
                </table>
                <h2>Dimensions</h2>
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th className="id">#</th>
                            <th className="title">Name</th>
                            <th className="title">Label</th>
                            <th className="title">Description</th>
                            {/* <th className="long">Definition</th>  */}
                            <th></th>
                        </tr>
                        {this.state.dimensions}
                    </tbody>
                </table>
                <Modal 
                    isOpen={this.state.load_modal}
                    style={{overlay: modalOverlayStyle, content: modalContentStyle}}
                >
                <h1>Loading...</h1>
                </Modal>
            </div>  
        )
    }

}

export class AppLoader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            app: '',
            app_name: '',
            apps: [],
            selected_app: '',
            selected_name: '',
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
                    <option key={idx} text={app.qDocName} value={app.qDocId + '#####' + app.qDocName}>{app.qDocName}</option>
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
            selected_app: event.target.value.split('#####' )[0],            
            selected_name: event.target.value.split('#####' )[1],
            value: event.target.text
        })
    }

    loadAppData(){
        this.setState({
            app: this.state.selected_app,
            app_name: this.state.selected_name
        })
    }

    render() {
        return(
            <div className="panel panel-default">
                <div className="panel-heading">Select an App to View Master Items</div>    
                <div className="panel-body">
                    <div className="input-group app-select" style={{textAlign:  'center'}}>
                        <select 
                            className="form-control"
                            value={this.state.value} 
                            onChange={this.handleChange}>
                            <option value=''>&lt;Select App&gt;</option>
                            {this.state.apps}
                        </select>
                        <span className="input-group-btn">
                            <input 
                                className="btn btn-success"
                                type="button"
                                value="Load"
                                onClick={this.loadAppData}
                            />
                        </span>
                    </div>
                    <ItemTable 
                        app={this.state.app} 
                        app_name={this.state.app_name} 
                    />
                </div>
            </div>
        )
    }
}

