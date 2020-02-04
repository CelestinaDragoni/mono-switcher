import ConfigDefault from '../schemas/config.json';
import clone from 'clone';

export default class ConfigService {

    /** Electron or Web Controller, Handles Various Items **/
    controller = null;

    /** Data storage array **/
    _data = {};

    /** Singleton Instance **/
    static instance = null;
    
    /**
     * Singleton constructor
     * @param {Function} updateHandler - Update handler, in views/Root
     * @param {Controller} controller - Either an instance of controllers/Electron or controllers/Web depending on webpack.
     * @return {ConfigService}
     **/
    static getInstance(updateHandler, controller) {
        if (ConfigService.instance) {
            return ConfigService.instance;
        }
        return ConfigService.instance = new ConfigService(updateHandler, controller);  
    }

    /**
     * Constructor
     * @param {Function} updateHandler - Update handler, in views/Root
     * @param {Controller} controller - Either an instance of controllers/Electron or controllers/Web depending on webpack.
     **/
    constructor(updateHandler, controller) {
        
        this.onUpdate   = updateHandler;
        this.controller = controller;

        // Electron controller uses electron-store, web uses local storage.
        this._data = this.controller.getConfig();
        if (!this._data) {
            this._data = clone(ConfigDefault);
        }
        
    }

    /**
     * Writes the config, the write for the static storage is in the controller methods based on platform.
     * @param {Function} callback - Callback function to controller.
     * @return {void}
     **/
    _writeConfig(callback=false) {

        this.onUpdate();

        // Electron controller uses electron-store, web uses local storage.
        this.controller.setConfig(this._data);

        if (callback) {
            callback();
        }

    }




    /////////////////////////////////////////////
    ////////// Getters
    /////////////////////////////////////////////




    /**
     * GETTER: Get the current serial port in use.
     * @return {string} port
     **/
    get port() {
        return this._data.port;
    }

    /**
     * GETTER: Get all of the ports in use.
     * @return {array} devices
     **/
    getDevices() {
        return this._data.devices;
    }

    /**
     * GETTER: Window size via an electron bounds (Electron Only)
     * @return {object} v
     **/
    get bounds() {
        return this._data.bounds;
    }


    /**
     * GETTER: Help window dialog display state.
     * @return {bool} v
     **/
    get modalHelp() {
        return this._data.modalHelp;
    }



    /////////////////////////////////////////////
    ////////// Setters
    /////////////////////////////////////////////

    /**
     * SETTER: Sets the serial port being used.
     * @param {string} v
     * @return {void}
     **/
    set port(v) {
        this._data.port = port;
        this._writeConfig();
    }

    /**
     * SETTER: Sets the device icon.
     * @param {object} v
     * @return {void}
     **/
    set deviceIcon(v) {
        this._data.devices[v.i].label = v.icon;
        this._writeConfig();
    }

    /**
     * SETTER: Sets the device label.
     * @param {object} v
     * @return {void}
     **/
    set deviceLabel(v) {
        this._data.devices[v.i].label = v.label;
        this._writeConfig();
    }

    /**
     * SETTER: Window bounds (Electron Only)
     * @param {object} v
     * @return {void}
     **/
    set bounds(v) {
        this._data.bounds = v;
        this._writeConfig();
    }

    /**
     * SETTER: Help Modal display/hide
     * @param {bool} v
     * @return {void}
     **/
    set modalHelp(v) {
        this._data.modalHelp = v;
        this._writeConfig();
    }

}
