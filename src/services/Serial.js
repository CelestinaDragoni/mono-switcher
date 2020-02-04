import Commands from '../schemas/serial.json';

export default class SerialService {

	/** On update handler **/
	onUpdate = null;

	/** Configuration service **/
	configService = null;

	/** Singleton Instance **/
    static instance = null;

	/**
     * Singleton constructor
     * @param {Function} updateHandler - Update handler, in views/Root
     * @param {ConfigService} configService -Instance of Config Service
     * @return {SerialService}
     **/
    static getInstance(updateHandler, configService) {
        if (ConfigService.instance) {
            return ConfigService.instance;
        }
        return ConfigService.instance = new ConfigService(updateHandler, configService);  
    }


    /**
     * Constructor
     * @param {Function} updateHandler - Update handler, in views/Root
     * @param {Controller} controller - Either an instance of controllers/Electron or controllers/Web depending on webpack.
     **/
    constructor(updateHandler, configService) {    
        this.onUpdate   = updateHandler;
        this.configService = configService;
    }

}