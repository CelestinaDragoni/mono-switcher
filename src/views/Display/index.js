import React from 'react';

import Button from '../../components/basic/button';
import Select from '../../components/basic/input/select';
import Toggle from '../../components/basic/input/toggle';
import Input from '../../components/basic/input/input';

import {RootContext} from '../../context/RootContext';

import "./index.sass";

export default class DisplayView extends React.Component {

    static contextType = RootContext;

    componentDidMount() {
        this.context.serial.getActiveHDMI();
    }

    onPortChange = (value) => {
        this.context.serial.setPort(value);
    }

    onDeviceChange = (value) => {
        this.context.serial.setActiveHDMI(parseInt(value));
    }

    onToggleConfig = (value) => {
        this.context.config.configuration = value;
    }

    onChangeLabel = (target, value) => {
        this.context.config.deviceLabel = {i:parseInt(target), label:value};
    }

    renderLoading() {
        const {loading} = this.context.config;
        if (loading) {
            return <div className='mono-loading'><i className='fas fa-sync-alt fa-spin'/></div>;
        }
        return null;
    }

    renderConfiguration() {

        const devices = this.context.config.getDevices();

        const elements = [];
        for (let i=0; i<8; i++) {
            elements.push(<section className='mono-container' key={i}>
                <div className='mono-container-label'>HDMI {i+1} LABEL</div>
                <div><Input value={devices[i].label} target={`${i}`} onChange={this.onChangeLabel}/></div>
            </section>);
        }

        return elements;

    }

    renderView() {

        const devices = this.context.config.getDevices();
        const {active} = this.context.serial;

        const elements = [];
        for (let i=0; i<8; i++) {
            const classActive = active===i ? 'active' : '';
            elements.push(<section className='mono-container' key={i}>
                <div className='mono-container-label'>HDMI {i+1}</div>
                <div className='mono-hdmi-label'>{devices[i].label}</div>
                <div className={`mono-icon-active ${classActive}`}><i className='fas fa-star'/></div>
                <div><Button icon='fas fa-star' value={i} onClick={this.onDeviceChange}>Set Active</Button></div>
            </section>);
        }

        return elements;

    }

    render() {

        const {port, configuration} = this.context.config;
        const {ports} = this.context.serial;
        const elements = (configuration) ? this.renderConfiguration() : this.renderView();
        
        return (
            <div >
                <header className='mono-header'>
                    <section className='mono-container full'>
                        <div className='mono-container-label'>Serial Device</div>
                        <Select value={port} options={ports} onChange={this.onPortChange}/>
                    </section>
                    <section className='mono-container full'>
                        <div className='mono-container-label'>Config Mode</div>
                        <Toggle value={configuration} onChange={this.onToggleConfig} />
                    </section>
                </header>
                <div className='mono-container-flex'>
                    {elements}
                </div>
                {this.renderLoading()}
            </div>
        );

    }

}
