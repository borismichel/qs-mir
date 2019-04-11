import React, { Component } from "react";

import '../styles/App.css';

export class MyReactForm extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            save: false,
            inputVal: 'default'
        };

        this.defaultState = {
            save: false,
            inputVal: 'default'
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }

    handleChange(event) {
        let value = (event.target.type==='checkbox') ? event.target.checked : event.target.value;
        this.setState(
            {[event.target.name]: value}
        )
    }

    handleSend(event) {
        event.preventDefault();

        // alert(((this.state.save==true) ? '':'Not ') + 'Saving:' + this.state.inputVal)
        fetch('http://localhost:1212/submit', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response)=> {
            console.log(response);
        })

        this.setState(this.defaultState);
    }

    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Save:</label>
                    <input
                        name='save'
                        type='Checkbox'
                        onChange={this.handleChange} 
                    />
                    <br />
                    <label>Text:</label>
                    <input  
                        name='inputVal'
                        type='text'
                        placeholder={this.state.inputVal}
                        onChange={this.handleChange} 
                    />
                    <br />
                    <input type='button' onClick={this.handleSend} value='Send' />
                </form>
                <div>
                    <p>
                        {(this.state.save==true) ? '':'Not '} Saving: {this.state.inputVal}
                    </p>
                </div>
            </div>
        )
    }

}

export class ItemTable extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);

        this.state = {
            measures: [],
            dimensions: [],
            app: ''
        }
        this.updateList = this.updateList.bind(this);
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

    updateList() {
        if(this.state.app =='') {return};
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';
        uri += '/api/qsmasterpull';

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
                    <tr>
                        <td class="id">{idx+1}</td>
                        <td class="title">{msrObj.title}</td>
                        <td class="title">{msrObj.label}</td>
                        <td class="title">{msrObj.desc}</td>
                        <td class="long">{msrObj.def}</td>
                    </tr>
                )
            })
            let dimArray = resultArray[1].map((dimObj, idx) => {
                return (
                    <tr>
                        <td class="id">{idx+1}</td>
                        <td class="title">{dimObj.title}</td>
                        <td class="title">{dimObj.label}</td>
                        <td class="title">{dimObj.desc}</td>
                        <td class="long">{dimObj.def}</td>
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
                <table>
                    <tbody>
                        <tr>
                            <th class="id">#</th>
                            <th class="title">Name</th>
                            <th class="title">Label</th>
                            <th class="title">Description</th>
                            <th class="long">Definition</th>
                        </tr>
                        {this.state.measures}
                    </tbody>
                </table>
                <h2>Dimensions</h2>
                <table>
                    <tbody>
                        <tr>
                            <th class="id">#</th>
                            <th class="title">Name</th>
                            <th class="title">Label</th>
                            <th class="title">Description</th>
                            <th class="long">Definition</th>
                        </tr>
                        {this.state.dimensions}
                    </tbody>
                </table>
            </div>  
        )
    }

}

export class AppDropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            app: '',
            apps: [],
            value: '<Select App>'
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        fetch('http://localhost:1212/api/qsgetdoclist')
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

    handleChange(event){
        this.setState({
            app: event.target.value,
            value: event.target.text
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
                </form>
                <ItemTable app={this.state.app} />
            </div>
        )
    }
}