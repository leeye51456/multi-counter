import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CounterAction from './counter-action';


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
          className={classNames({ 'force-hidden': this.props.onInvert === CounterAction.PRESETS.NO_OP })}
        >
          [-]
        </button>
        <button
          type="button"
          onClick={this.handleResetClick}
          className={classNames({ 'force-hidden': this.props.onReset === CounterAction.PRESETS.NO_OP })}
        >
          [R]
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
  onChange: CounterAction.PRESETS.NO_OP,
  onInvert: CounterAction.PRESETS.NO_OP,
  onReset: CounterAction.PRESETS.NO_OP,
};

export default NumberInput;
