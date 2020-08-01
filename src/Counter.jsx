import React from 'react';
import PropTypes from 'prop-types';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
      editable: false,
      newValue: '',
      oldValue: this.props.value,
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

  callOnChange = () => {
    const {value, oldValue} = this.state;
    if (value !== oldValue) {
      this.props.onChange(value);
    }
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
    }, this.callOnChange);
  }

  handleCountUpClick = () => {
    this.setState((state, props) => {
      const newValue = state.value + props.step;
      return {
        value: this.getCorrectValue(newValue),
        oldValue: state.value,
      };
    }, this.callOnChange);
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
    }, this.callOnChange);
  }

  handleResetClick = () => {
    this.setState((state, props) => ({
      value: props.initial,
      editable: false,
      newValue: '',
      oldValue: state.value,
    }), this.callOnChange);
  }

  render = () => {
    return (
      <div>
        <label>
          {this.props.name}
        </label>

        <div
          style={{display: this.state.editable ? 'none' : 'inline-block'}}
        >{/* editable === false */}
          <input
            type="text"
            value={this.state.value}
            readOnly={true}
          />
          <button
            type="button"
            onClick={this.handleEditClick}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={this.handleCountDownClick}
          >
            -
          </button>
          <button
            type="button"
            onClick={this.handleCountUpClick}
          >
            +
          </button>
          <button
            type="button"
            onClick={this.handleResetClick}
          >
            Reset
          </button>
        </div>

        <div
          style={{display: this.state.editable ? 'inline-block' : 'none'}}
        >{/* editable === true */}
          <input
            type="text"
            value={this.state.newValue}
            onChange={this.handleValueInputChange}
          />
          <button
            type="button"
            onClick={this.handleCancelClick}
          >
            X
          </button>
          <button
            type="button"
            onClick={this.handleApplyClick}
          >
            OK
          </button>
        </div>
      </div>
    );
  }
}

Counter.propTypes = {
  initial: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
}

Counter.defaultProps = {
  initial: 0,
  value: 0,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  name: '',
  onChange: () => {},
};

export default Counter;
