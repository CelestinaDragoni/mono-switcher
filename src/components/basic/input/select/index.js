import React from "react";
import PropTypes from 'prop-types';
import "./index.sass";

export default class Select extends React.Component {

    /** React PropTypes **/
    static propTypes = {
        onChange:PropTypes.func,
        target:PropTypes.string,
        options:PropTypes.array
    };

    /** React PropType Defaults **/
    static defaultProps = {
        onChange:null,
        target:'',
        value:'',
        options:[]
    };

    onChange = (e) => {
        if (this.props.onChange) {
            if (this.props.target) {
                this.props.onChange(this.props.target, e.target.value);
            } else {
                this.props.onChange(e.target.value);
            }
        }
    }

    render() {

        const options = [];
        if (this.props.options && this.props.options.length > 0) {
            let count = 0;
            for (const option of this.props.options) {
                const value     = (typeof option.value === 'undefined') ? '' : option.value;
                const label     = (typeof option.label === 'undefined') ? value : option.label;
                const className = (typeof option.className === 'undefined') ? '' : option.className;
                options.push(<option key={count} value={value} className={className}>{label}</option>);
                count+=1;
            }
        }

        return <select value={this.props.value} className='mono-input-select' onChange={this.onChange}>
            {options}
        </select>;

    }

}
