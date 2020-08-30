import React from 'react';
import PropTypes from 'prop-types';
import { GlobalEditModeContext } from './contexts';
import CounterAction from './counter-action';

export class Counter extends React.Component {
  getCorrectValue = (newValue) => {
    if (newValue < this.props.min) {
      newValue = this.props.min;
    } else if (newValue > this.props.max) {
      newValue = this.props.max;
    }
    return newValue;
  }

  callOnChangeByValue = (newValue, defaults) => {
    newValue = this.getCorrectValue(newValue);
    if (this.props.value !== newValue) {
      this.props.onChange({
        ...defaults,
        value: newValue,
        name: this.props.name,
      });
    }
  }

  countDown = () => {
    const newValue = this.props.value - this.props.step;
    this.callOnChangeByValue(newValue);
  }

  countUp = () => {
    const newValue = this.props.value + this.props.step;
    this.callOnChangeByValue(newValue);
  }

  handleCheckboxChange = (event) => {
    this.props.onChange({
      checked: event.target.checked,
      name: this.props.name,
    });
  }

  handleEditClick = () => {
    this.props.onEditClick(this.props.name);
  }

  handleCountDownClick = () => {
    this.countDown();
  }

  handleCountUpClick = () => {
    this.countUp();
  }

  handleResetClick = () => {
    this.callOnChangeByValue(this.props.initial);
  }

  render = () => {
    const isGlobalEditModeEnabled = this.context;

    const always = 'inline-block';
    const normalOnly = isGlobalEditModeEnabled ? 'none' : 'inline-block';
    const editModeOnly = isGlobalEditModeEnabled ? 'inline-block' : 'none';

    return (
      <div>
        <ul>
          <li style={{display: editModeOnly}}>
            <input
              type="checkbox"
              checked={this.props.checked}
              onChange={this.handleCheckboxChange}
            />
          </li>

          <li style={{display: always}}>
            <label>
              {this.props.name}
            </label>
          </li>

          <li style={{display: always}}>
            <input
              type="text"
              value={this.props.value}
              readOnly={true}
            />
          </li>

          <li style={{display: normalOnly}}>
            <button
              type="button"
              onClick={this.handleCountDownClick}
            >
              -
            </button>
          </li>

          <li style={{display: normalOnly}}>
            <button
              type="button"
              onClick={this.handleCountUpClick}
            >
              +
            </button>
          </li>

          <li style={{display: editModeOnly}}>
            <button
              type="button"
              onClick={this.handleEditClick}
            >
              Edit
            </button>
          </li>

          <li style={{display: editModeOnly}}>
            <button
              type="button"
              onClick={this.handleResetClick}
            >
              Reset
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

Counter.contextType = GlobalEditModeContext;

Counter.propTypes = {
  initial: PropTypes.number,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onEditClick: PropTypes.func,
};

Counter.defaultProps = {
  initial: 0,
  value: 0,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  name: '',
  checked: false,
  onChange: CounterAction.PRESETS.NO_OP,
  onEditClick: CounterAction.PRESETS.NO_OP,
};

export default Counter;
