import React from 'react';
import PropTypes from 'prop-types';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: this.props.value,
      editable: false,
      newCount: '',
      oldCount: this.props.value,
    };
  }

  callOnChange = () => {
    const {count, oldCount} = this.state;
    if (count !== oldCount) {
      this.props.onChange(count);
    }
  }

  handleEditClick = () => {
    this.setState((state) => ({
      editable: true,
      newCount: state.count,
    }));
  }

  handleCountDownClick = () => {
    this.setState((state, props) => {
      const newCount = state.count - props.step;
      return {
        count: (newCount < props.min) ? props.min : newCount,
        oldCount: state.count,
      };
    }, this.callOnChange);
  }

  handleCountUpClick = () => {
    this.setState((state, props) => {
      const newCount = state.count + props.step;
      return {
        count: (newCount > props.max) ? props.max : newCount,
        oldCount: state.count,
      };
    }, this.callOnChange);
  }

  handleCountInputChange = (event) => {
    this.setState({
      newCount: event.target.value,
    });
  }

  handleCancelClick = () => {
    this.setState({
      editable: false,
      newCount: '',
    });
  }

  handleApplyClick = () => {
    this.setState((state, props) => {
      const newState = {
        editable: false,
        newCount: '',
        oldCount: state.count,
      };

      let newCount = Number.parseInt(state.newCount);
      if (isNaN(newCount)) {
        return newState;
      }

      if (newCount < props.min) {
        newCount = props.min;
      } else if (newCount > props.max) {
        newCount = props.max;
      }

      if (newCount !== state.count) {
        newState.count = newCount;
      }
      return newState;
    }, this.callOnChange);
  }

  render = () => {
    return (
      <div>
        <label>
          {this.props.label}
        </label>

        <div
          style={{display: this.state.editable ? 'none' : 'inline-block'}}
        >{/* editable === false */}
          <input
            type="text"
            value={this.state.count}
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
        </div>

        <div
          style={{display: this.state.editable ? 'inline-block' : 'none'}}
        >{/* editable === true */}
          <input
            type="text"
            value={this.state.newCount}
            onChange={this.handleCountInputChange}
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
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  label: PropTypes.string,
  onChange: PropTypes.func,
}

Counter.defaultProps = {
  value: 0,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  label: '',
  onChange: () => {},
};

export default Counter;
