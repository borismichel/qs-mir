import React, { Component } from "react";
import 'whatwg-fetch'; 

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
                    <input type='button' onClick={this.handleSend}></input>
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