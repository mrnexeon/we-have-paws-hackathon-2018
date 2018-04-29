import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Cart from './Components/Cart'
import Viewer from './Components/Viewer';
import ReactObserver from 'react-event-observer';
import './place-only-demo.css';

class App extends Component {
    constructor(props){
        super(props);
        this.observer = ReactObserver();

        this.onItemHovered = this.onItemHovered.bind(this);

    }

    onItemHovered(item) {
        {/* TODO: Добавить обработчик событий */}

        console.log(item)
    }

    render() {
        return (
            <div className='app-container'>
                <Cart observer={this.observer} />
                <Viewer onItemHovered={this.onItemHovered} observer={this.observer} />
            </div>
        );
    }
}

ReactDOM.render(
    (<div>
        <App />
    </div>),
    document.getElementById('root')
);
