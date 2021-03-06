import React, { Component } from 'react';
import './Viewer.css';
import HTTPPromises from './utils/HTTPPromises';
import * as viewerLoader from './utils/ViewerLoader';
import cloneFunction from 'clone-function';
import ViewerModal from './ViewerModal';

class Viewer extends Component {
    constructor(props) {
        super(props);
        this.observer = props.observer;

        this.setStaticControls = this.setStaticControls.bind(this);
        this.sitOnPlace = this.sitOnPlace.bind(this);
        this.subscribeToObserverEvents = this.subscribeToObserverEvents.bind(this);
        this.onMouseUpHandler = this.onMouseUpHandler.bind(this);
        this.updateDynamicControls = this.updateDynamicControls.bind(this);
        this.onMouseMoved = this.onMouseMoved.bind(this);

        this.state = {
            viewer: null,
            mouseButtonDownHandler: null,
            isLoaded: false,
            seatPicked: false,
        };

        this.viewerElem = React.createRef();
    }

    componentDidMount() {
        var self = this;
        this.subscribeToObserverEvents();

        HTTPPromises.getAuthToken().then(function (response) {
            viewerLoader.load(response, self.observer);
        });
    }

    subscribeToObserverEvents() {
        var self = this;
        self.observer.subscribe("VIEWER_LOADED", (data) => {
            self.setState({
                viewer: data,
                mouseButtonDownHandler: cloneFunction(data.toolController.handleButtonDown)
            });
            
            this.state.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (event) => {
                this.observer.publish('ITEM_SELECTED', event); 
            });

            {/*this.setStaticControls();*/}
            this.updateDynamicControls();
        });

        self.observer.subscribe("VIEWER_TEXTURES_LOADED", (data) => {
            self.setState({
                isLoaded: true
            });
        });

        self.observer.subscribe("CARTITEM_SELECTED", (data) => {
            this.sitOnPlace(data);
        });
    }

    sitOnPlace(data) { {/* TODO: Функция не относиться к Viewer, а к Модели - не та абстракция*/ }
        var self = this;
        if (self.state.isLoaded == false) return;

        self.setState({
            seatPicked: true
        })

        let item = self.state.viewer.impl.model.getData().fragments.fragId2dbId.indexOf(parseInt(data));

        if (item == -1) return;

        let fragbBox = new THREE.Box3();
        let nodebBox = new THREE.Box3();

        [item].forEach(function (fragId) {
            self.state.viewer.model.getFragmentList().getWorldBounds(fragId, fragbBox);
            nodebBox.union(fragbBox);
        });

        let bBox = nodebBox;

        let camera = self.state.viewer.getCamera();
        let navTool = new Autodesk.Viewing.Navigation(camera);

        let position = bBox.max;

        let pivPointPosition = JSON.parse(JSON.stringify(position));
        pivPointPosition.z -= 0.1
        navTool.setPivotPoint(pivPointPosition);
        navTool.setPivotSetFlag(true);
        self.state.viewer.setUsePivotAlways(true);
        navTool.setVerticalFov(70, true);

        let target = new THREE.Vector3(0, 0, -30);
        let up = new THREE.Vector3(0, 0, 1);

        navTool.setView(position, target);
        navTool.setWorldUpVector(up, true);
    }

    onMouseUpHandler() {
        this.updateDynamicControls();
    }

    setStaticControls() {
        this.state.viewer.toolController.handleWheelInput = function () { };
        this.state.viewer.toolController.handleSingleClick = function () { };
        this.state.viewer.toolController.handleDoubleClick = function () { };
    }

    updateDynamicControls() {
        var self = this;
        this.state.viewer.toolController.handleButtonDown = function (e) {
            if (e.button === 0) {
                self.state.viewer.toolController.handleButtonDown = self.state.mouseButtonDownHandler;
                self.state.viewer.toolController.mousedown(e);
            }
        };
    }

    onMouseMoved(e) {
        let mousePosition = { x: e.pageX, y: e.pageY }
        let offset = this.viewerElem.current.getBoundingClientRect();

        let x = mousePosition.x - offset.x;
        let y = mousePosition.y - offset.y;

        let res = this.state.viewer.impl.castRay(x, y, false);
        if (res) this.observer.publish('ITEM_HOVERED', res); 
    }

    render() {
        return (
            <div className="wrapper">

                <ViewerModal isOpen={!this.state.isLoaded}>
                    <div className="preloader-spinner" />
                    <h6 className="preloader-text">Загрузка..</h6>
                </ViewerModal>
                {/*
                <ViewerModal isOpen={this.state.isLoaded && !this.state.seatPicked}>
                    <h6>Выберете место для предпросмотра</h6>
                </ViewerModal>
                */}
                <div id="viewer-div" ref={this.viewerElem} onMouseMove={this.onMouseMoved} onMouseUp={this.onMouseUpHandler}>
                </div>
            </div>
        );
    }
}

export default Viewer;
