import React, { Component } from 'react';
import './ViewerModal.css'

class ViewerModal extends Component {
    render() {
        return (
            <div className={this.props.isOpen ? 'modal-box' : 'hidden'}>
                {this.props.children}
            </div>
        );
    }
}

export default ViewerModal;