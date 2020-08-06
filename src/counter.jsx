import React from 'react';
import PropTypes from 'prop-types';
import { EditModeContext } from './contexts';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
      editable: false,
      newValue: '',
      oldValue: this.props.value,
      isGlobalEditModeEnabled: false,
      checked: this.props.checked,
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

  callOnChangeByValue = () => {
    const { value, oldValue, checked } = this.state;
    if (value !== oldValue) {
      this.props.onChange({ value, checked });
    }
  }

  callOnChangeByChecked = () => {
    const { value, checked } = this.state;
    this.props.onChange({ value, checked });
  }

  handleCheckboxChange = (event) => {
    this.setState({
      checked: event.target.checked,
    }, this.callOnChangeByChecked);
  }

  handleEditClick = () => {
    this.setState((state) => ({
      editable: true,
      newValue: state.value,
    }));
  }

  handleCountDownClick = () => {
    this.setState((state, props) => {
      const newValue = state.value - props.step;
      return {
        value: this.getCorrectValue(newValue),
        oldValue: state.value,
      };
    }, this.callOnChangeByValue);
  }

  handleCountUpClick = () => {
    this.setState((state, props) => {
      const newValue = state.value + props.step;
      return {
        value: this.getCorrectValue(newValue),
        oldValue: state.value,
      };
    }, this.callOnChangeByValue);
  }

  handleValueInputChange = (event) => {
    this.setState({
      newValue: event.target.value,
    });
  }

  handleCancelClick = () => {
    this.setState({
      editable: false,
      newValue: '',
    });
  }

  handleApplyClick = () => {
    this.setState((state, props) => {
      const newState = {
        editable: false,
        newValue: '',
        oldValue: state.value,
      };

      let newValue = Number.parseInt(state.newValue, 10);
      if (isNaN(newValue)) {
        return newState;
      }

      newState.value = this.getCorrectValue(newValue);
      return newState;
    }, this.callOnChangeByValue);
  }

  render = () => {
    const isThisEditable = this.state.editable;
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
              checked={this.state.checked}
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
              value={this.state.value}
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
              value={this.state.newValue}
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
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  name: PropTypes.string,
  checked: PropTypes.bool,
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
  onChange: () => {},
};

export default Counter;
