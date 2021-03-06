import React, { Component } from 'react';
import './SelectInput.css'

class SelectInput extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onSelected(e.target.value); // 👈 Change on your function
    }

    render() {
        let options = this.props.options.map((item) => <option>{item}</option>)

        return (
            <div>
                <legend>{this.props.name}</legend>
                <select onChange={this.handleChange}>
                    {options}
                </select>
            </div>
        );
    }
}

export default SelectInput;