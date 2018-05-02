import React, { Component } from 'react';

import * as dataTools from '../../data/dataTools';

import './Summary.css'

class Summary extends Component {
    constructor(props) {
        super(props);
        this.observer = props.observer;

        this.state = {
            sector: '',
            row: '',
            seat: ''
        }

        this.observer.subscribe('ITEM_HOVERED', (data) => {
            let forgeID = data.dbId;

            let res = dataTools.GetCoordinatesByForgeId(forgeID);
            if (!res) return;

            this.setState({
                sector: res[0],
                row: res[1],
                seat: res[2]
            })
        })
    }
    render() {
        return (
            <div>
                <h1>Информация</h1>
                <ul>
                    <li>Сектор: {this.state.sector}</li>
                    <li>Ряд: {this.state.row}</li>
                    <li>Место: {this.state.seat}</li>
                </ul>
            </div>
        );
    }
}

export default Summary;