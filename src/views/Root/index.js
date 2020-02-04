import React from 'react';
import PropTypes from 'prop-types';

// Services
import ConfigService from   '../../services/Config';
import SerialService from '../../services/Serial';

// Views
//import ConfigView from '../Config';
//import ModuleView from '../Module';
//import StyleView from '../Style';

// Modals
//import HelpModal from '../../components/compound/modals/HelpModal';

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
        serial:null
    }

    constructor(props) {

        super();

        // Initalize Controller (Form of dependency injection depending on electron or web interface)
        props.controller.init(this);

        // Initalize Global Services
        this.services.config        = ConfigService.getInstance(this.onServiceUpdate, props.controller);
        this.services.language      = SerialService.getInstance(this.onServiceUpdate, this.services.config);

        // Stuff that shouldn't be true when launching.
        this.services.config.modalHelp = false;

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

        const {modalHelp} = this.services.config;
        return <RootContext.Provider value={this.services}>
            <div>Test</div>
        </RootContext.Provider>;
        
    }

}
