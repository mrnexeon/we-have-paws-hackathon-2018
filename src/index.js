import ReactDOM from 'react-dom';
import React, { Component } from 'react';

import NavigationBar from './Components/NavigationBar';
import Cart from './Components/Cart'
import Summary from './Components/Summary';
import SelectInput from './Components/SelectInput';
import Viewer from './Components/Viewer';

import ReactObserver from 'react-event-observer';
import * as dataTools from './data/dataTools';

class App extends Component {
    constructor(props) {
        super(props);
        this.observer = ReactObserver();

    }

    render() {
        return (
            <div>
                <NavigationBar />
                <Viewer observer={this.observer} />
                <Cart observer={this.observer} />
                <Summary observer={this.observer} />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);