import React, { Component } from "react";

import '../styles/App.css';

export function MyTable(props) {
    return (
        <table>
            <tbody>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                </tr>
                {props.rows.map((val, idx) => {
                    return <MyTableRow key={idx} c1={val.c1} c2={val.c2} c3={val.c3}/>
                })}
            </tbody>
        </table>
    )
}

export function MyTableRow(props) {
    return (
        <tr>
            <td>{props.c1}</td>
            <td>{props.c2}</td>
            <td>{props.c3}</td>
        </tr>
    )
}

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

        this.state = {
            measures: [],
            dimensions: []
        }
    }

    componentDidMount() {
        let uri = window.location.protocol;
        uri += '//' + window.location.hostname;
        uri += (window.location.port.length > 0) ? (':' + window.location.port):'';
        uri += '/api/qsmasterpull';

        console.log('Mounting');
        console.log(uri);

        fetch(uri, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({"app": "C:\\Users\\bmichel\\Documents\\Qlik\\Sense\\Apps\\Consumer Goods Sales 3.0.qvf"})
        })
        .then((response) => {
            return response.json();
        })
        .then(resultArray => {
            let msrArray = resultArray[0].map((msrObj) => {
                return (
                    <tr>
                         <td>{msrObj.qMeta.title}</td>
                         <td>{msrObj.qMeta.description}</td>
                    </tr>
                )
            })
            let dimArray = resultArray[1].map((dimObj) => {
                return (
                    <tr>
                         <td>{dimObj.qMeta.title}</td>
                         <td>{dimObj.qMeta.description}</td>
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
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        {this.state.measures}
                    </tbody>
                </table>
                <h2>Dimensions</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                        {this.state.dimensions}
                    </tbody>
                </table>
            </div>  
        )
    }

}