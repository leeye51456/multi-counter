import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NO_OP } from './utils';
import icons from './icons';


const customProps = ['initial', 'onInvert', 'onReset'];

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.validity = {};
  }

  componentDidMount = () => {
    this.validity = this.inputRef.current.validity;
  }

  handleInputChange = (event) => {
    this.validity = event.target.validity;
    this.props.onChange(event);
  }

  handleInvertClick = (event) => {
    event.preventDefault();
    if (this.props.value !== '') {
      this.props.onInvert();
    }
  }

  handleResetClick = (event) => {
    event.preventDefault();
    this.props.onReset();
  }

  render = () => {
    const inputProps = { ...this.props };
    for (const customProp of customProps) {
      if (inputProps.hasOwnProperty(customProp)) {
        delete inputProps[customProp];
      }
    }

    return (
      <div className="extended-input">
        <input
          { ...inputProps }
          ref={this.inputRef}
          type="number"
          inputMode="numeric"
          onChange={this.handleInputChange}
        />
        <button
          type="button"
          onClick={this.handleInvertClick}
          className={classNames({ 'force-hidden': this.props.onInvert === NO_OP })}
        >
          <img src={icons.invert} alt="Invert sign of this value" />
        </button>
        <button
          type="button"
          onClick={this.handleResetClick}
          className={classNames({ 'force-hidden': this.props.onReset === NO_OP })}
        >
          <img src={icons.reset} alt="Reset this value" />
        </button>
      </div>
    );
  }
}

NumberInput.propTypes = {
  onChange: PropTypes.func,
  onInvert: PropTypes.func,
  onReset: PropTypes.func,
};

NumberInput.defaultProps = {
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  value: '',
  onChange: NO_OP,
  onInvert: NO_OP,
  onReset: NO_OP,
};

export default NumberInput;
