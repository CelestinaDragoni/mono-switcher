// Note: Serialport is rebuilt into Electron, import not required.
import InterByteTimeout from '@serialport/parser-inter-byte-timeout';
import Commands from '../schemas/serial.json';

export default class SerialService {

    /** List of avaliable devices **/
    ports = [];

    /** Current Port **/
    port = '';

    /** Active HDMI **/
    active = -1;

    /** On update handler **/
    onUpdate = null;

    /** Configuration service **/
    configService = null;

    /** Serial port connection **/
    connection = null;

    /** Is connected **/
    connected = false;

    /** Response **/
    response = [];
    responseHandler = '';

    /** Singleton Instance **/
    static instance = null;

    /**
     * Singleton constructor
     * @param {Function} updateHandler - Update handler, in views/Root
     * @param {ConfigService} configService -Instance of Config Service
     * @return {SerialService}
     **/
    static getInstance(updateHandler, configService) {
        if (SerialService.instance) {
            return SerialService.instance;
        }
        return SerialService.instance = new SerialService(updateHandler, configService);  
    }


    /**
     * Constructor
     * @param {Function} updateHandler - Update handler, in views/Root
     * @param {Controller} configService - Configuration service
     **/
    constructor(updateHandler, configService) {    
        this.onUpdate       = updateHandler;
        this.configService  = configService;
        this.port           = this.configService.port;
        this.initPorts();
        this.connect();
    }

    setPort(port) {
        this.port = this.configService.port = port;
        this.close();
        this.connect();
        this.getActiveHDMI();
    }

    connect(callback = false) {

        try {

            window.connection = this.connection = new SerialPort(this.port, {
                baudRate: 9600,
                parity: "none",
                stopBits: 1,
                dataBits: 8,
                autoOpen: true
            });

            const parser = this.connection.pipe(new InterByteTimeout({interval: 200}));
            parser.on('data', this.onHdmiQuery);

            this.connection.on('error', function(err) {
                console.error('Connection Error: ', err.message);
            });


        } catch (e) {
            this.active = -1;
            console.error('Could not connect to serial port...');
        }

    }

    close() {
        if (this.connection) {
            this.connection.close();
            this.connection = false;
        }
    }

    onHdmiQuery = (buffer) => {
        const response = this.byteToString(buffer);
        for(const i in Commands.queryResponse) {
            if (response.includes(Commands.queryResponse[i])) {
                this.configService.loading = false;
                this.active = parseInt(i);
                this.onUpdate();
                return;
            }
        }
    }

    /**
     * Gets the active HDMI port at load
     * @return {void}
     **/
    getActiveHDMI = () => {

        // Lock
        this.configService.loading = true;

        // Do Query
        const query = this.stringToByte(Commands.query);

        // Write Buffer
        try {
            this.connection.write(query, (err) => {
                if (err) {
                    console.error('Could not get active HDMI', err);
                }

                // Timeout if we never get a response
                setTimeout(() => {
                    if (this.configService.loading) {
                        console.error('Response timed out. Are you connected to the correct device?');
                        this.active = -1;
                        this.configService.loading = false;
                    }
                }, 2000);

            });
            this.connection.drain();
        } catch {
            this.configService.loading = false;
            console.error('No Connection');
        }
        

    }

    /**
     * Sets the active HDMI through serial.
     * @param {number} port - Port index (0-7)
     * @return {void}
     **/
    setActiveHDMI = (port) => {

        if (this.configService.loading) {
            return;
        }

        // Lock
        this.configService.loading = true;

        // Do Query
        const query = this.stringToByte(Commands.queryPorts[port]);
        
        // Write Buffer
        try {
            this.connection.write(query, (err) => {
                if (err) {
                    console.error('Could switch HDMI device', err);
                    this.configService.loading = false;
                } else {
                    setTimeout(() => {
                        this.getActiveHDMI();
                    }, 500);
                }
            });
            this.connection.drain();
        } catch {
            console.error('No Connection');
            this.configService.loading = false;
        }

    }

    /**
     * Converts a hex string into a byte array.
     * @param {string} string - Hex string delimited by spaces
     * @return {array}
     **/
    stringToByte(string) {
        const byteArray = [];
        const stringArray = string.split(' ');
        for (const val of stringArray) {
            byteArray.push(parseInt(`0x${val}`));
        }
        return byteArray;
    }

    /**
     * Converts a buffer array into hex strings for comparison.
     * @param {Buffer} buffer - Byte buffer from SerialPort
     * @return {string}
     **/
    byteToString(buffer) {
        const string = [];
        for (let i = 0; i< buffer.length; i++) {
            string.push(("0"+buffer[i].toString(16)).slice(-2).toUpperCase());
        }
        return string.join(' ');
    }

    /**
     * Refreshes The Ports On-Demand
     * @return {void}
     **/
    refreshPorts() {
        this.ports = [];
        this.initPorts();
    }

    /**
     * Loads the ports from serialport driver.
     * @return {void}
     **/
    async initPorts() {
        this.ports = [{value:'', label:"No Device Selected"}];
        try {
            const ports = await SerialPort.list();
            for (const port of ports) {

                // Port Communication Name
                let name = port.comName;

                // Port Identifier for Select Menu
                if (typeof port.pnpId !== 'undefined') {
                    name = `${name} (${port.pnpId})`;
                }

                // Add to Port List
                this.ports.push({
                    value:port.comName,
                    label:name
                });
            }
            this.onUpdate();
        } catch (err) {
            alert(`Could not get list of ports. Do you have permission?\n${err}`);
        }
    }

}
