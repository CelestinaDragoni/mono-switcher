import {remote, shell} from 'electron';
import clone from 'clone';
import store from 'electron-store';

export default class ElectronController {

    /** Root View Controller **/
    controller = null;

    /** Electron Store Object **/
    store = null;

    /** Timeout Reference for Window Resize **/
    windowResizeTimeout = null;

    /** If we're currently running electron **/
    isElectron = true;

    /**
     * Starts binding actions for electron.
     * @param {RootViewController} controller
     * @return {void}
     **/
    init(controller) {
        
        this.controller = controller;
        this.store = new store();

        remote.getCurrentWindow().removeAllListeners();

        remote.getCurrentWindow().on('resize', this.onWindowChange);
        remote.getCurrentWindow().on('move', this.onWindowChange);

        //remote.globalShortcut.register('F5', this.reload);
        //remote.globalShortcut.register('F5', this.reload);

        window._link = this.onExternalLink;
    }

    /**
     * Used in services/Config, gets the configuration from file if it exists.
     * @return {mixed}
     **/
    getConfig() {
        return this.store.get('config');
    }

    /**
     * Saves the configuration to the store.
     * @param {object} config - Configuration dictionary
     * @return {void}
     **/
    setConfig(config) {
        this.store.set('config', config);
    }

    /**
     * Sets the last window bounds on startup.
     * @return {void}
     **/
    setWindowBounds() {
        remote.getCurrentWindow().setBounds(this.controller.services.config.bounds);
    }

    /**
     * Event: Handles window resize and puts it into the store. Uses a timeout for performance reasons.
     * @return {void}
     **/
    onWindowChange = () => {
        clearTimeout(this.windowResizeTimeout);
        this.windowResizeTimeout = setTimeout(this.onWindowChangeTimeout, 500);
    }

    /**
     * Timeout Function: Writes the bounds to the configuration.
     * @return {void}
     **/
    onWindowChangeTimeout = () => {
        if (!this.controller.services.config.broadcast) {
            this.controller.services.config.bounds = clone(remote.getCurrentWindow().getBounds());
        }
    }

    /**
     * Used to handle external URLs in electron.
     * @param {Event} e
     * @return {void}
     **/
    onExternalLink(e) {
        e.preventDefault();
        shell.openExternal(e.target.href);
    }

    /**
     * Reload electron window.
     * @return {void}
     **/
    reload = () => {
        remote.getCurrentWindow().reload();
    }

    devTools = () => {
        remote.getCurrentWindow().webContents.openDevTools();
    }

}
