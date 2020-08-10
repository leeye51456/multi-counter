import React from 'react';
import PropTypes from 'prop-types';
import { EditModeContext } from './contexts';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tempValue: '',
    };
  }

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

  handleCheckboxChange = (event) => {
    this.props.onChange({
      checked: event.target.checked,
      name: this.props.name,
    });
  }

  handleEditClick = () => {
    this.setState((state, props) => {
      props.onChange({
        editable: true,
        name: props.name,
      });
      return { tempValue: props.value };
    });
  }

  handleCountDownClick = () => {
    const newValue = this.props.value - this.props.step;
    this.callOnChangeByValue(newValue);
  }

  handleCountUpClick = () => {
    const newValue = this.props.value + this.props.step;
    this.callOnChangeByValue(newValue);
  }

  handleValueInputChange = (event) => {
    this.setState({ tempValue: event.target.value });
  }

  handleCancelClick = () => {
    this.setState((state, props) => {
      props.onChange({
        editable: false,
        name: props.name,
      });
      return { tempValue: '' };
    })
  }

  handleApplyClick = () => {
    this.setState((state) => {
      const newValue = Number.parseInt(state.tempValue, 10);
      if (!isNaN(newValue)) {
        this.callOnChangeByValue(newValue, { editable: false });
      }
      return { tempValue: '' };
    });
  }

  render = () => {
    const isThisEditable = this.props.editable;
    const isGlobalEditModeEnabled = this.context;

    const always = 'inline-block';
    const normalOnly = isThisEditable || isGlobalEditModeEnabled ? 'none' : 'inline-block';
    const globalEditModeOnly = isGlobalEditModeEnabled ? 'inline-block' : 'none';
    const editableOnly = isThisEditable ? 'inline-block' : 'none';
    const nonEditableOnly = isThisEditable ? 'none' : 'inline-block';

    return (
      <div>
        <ul>
          <li style={{display: globalEditModeOnly}}>
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

          <li style={{display: nonEditableOnly}}>
            <input
              type="text"
              value={this.props.value}
              readOnly={true}
            />
          </li>

          <li style={{display: normalOnly}}>
            <button
              type="button"
              onClick={this.handleEditClick}
            >
              Edit
            </button>
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

          <li style={{display: editableOnly}}>
            <input
              type="text"
              value={this.state.tempValue}
              onChange={this.handleValueInputChange}
            />
          </li>

          <li style={{display: editableOnly}}>
            <button
              type="button"
              onClick={this.handleCancelClick}
            >
              X
            </button>
          </li>

          <li style={{display: editableOnly}}>
            <button
              type="button"
              onClick={this.handleApplyClick}
            >
              OK
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

Counter.contextType = EditModeContext;

Counter.propTypes = {
  initial: PropTypes.number,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  name: PropTypes.string,
  checked: PropTypes.bool,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
}

Counter.defaultProps = {
  initial: 0,
  value: 0,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  name: '',
  checked: false,
  editable: false,
  onChange: () => {},
};

export default Counter;
