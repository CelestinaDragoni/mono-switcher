import React from 'react';
import PropTypes from 'prop-types';

// Services
import ConfigService from   '../../services/Config';
import SerialService from '../../services/Serial';

// Views
import DisplayView from '../Display';

// Context
import {RootContext} from '../../context/RootContext';

// Global Styles
import "../../styles/main.sass";

export default class RootViewController extends React.Component {

    /** React PropTypes **/
    static propTypes = {
        controller:PropTypes.object.isRequired
    };

    services = {
        config:null,
        serial:null,
        functions:{}
    }

    constructor(props) {

        super();

        // Initalize Controller (Form of dependency injection depending on electron or web interface)
        props.controller.init(this);

        // Initalize Global Services
        this.services.config        = ConfigService.getInstance(this.onServiceUpdate, props.controller);
        this.services.serial        = SerialService.getInstance(this.onServiceUpdate, this.services.config);
        this.services.functions     = {reload: props.controller.reload};

        // Stuff that shouldn't be true when launching.
        this.services.config._data.configuration = false;
        this.services.config._data.loading = false;

        // Reload bounds after launch (Electron only)
        if (props.controller.setWindowBounds) {
            props.controller.setWindowBounds();
        }

    }

    onServiceUpdate = () => {
        // Handles forcing the state update from a service.
        this.forceUpdate();
    }

    render() {
        return <RootContext.Provider value={this.services}>
            <DisplayView/>
        </RootContext.Provider>;
        
    }

}
