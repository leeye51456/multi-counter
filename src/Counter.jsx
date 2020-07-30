import React from 'react';
import PropTypes from 'prop-types';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      editable: false,
      newCount: 0,
    };
  }

  handleEditClick = () => {
    this.setState({
      editable: true,
      newCount: this.state.count,
    });
  }

  handleCountDownClick = () => {
    const newCount = this.state.count - this.props.step;
    this.setState({
      count: (newCount < this.props.min) ? this.props.min : newCount,
    }, this.onChange);
  }

  handleCountUpClick = () => {
    const newCount = this.state.count + this.props.step;
    this.setState({
      count: (newCount > this.props.max) ? this.props.max : newCount,
    }, this.onChange);
  }

  handleCountInputChange = (event) => {
    this.setState({
      newCount: event.target.value,
    });
  }

  handleCancelClick = () => {
    this.setState({
      editable: false,
    });
  }

  handleApplyClick = () => {
    let newCount = this.state.newCount;
    if (isNaN(newCount)) {
      return;
    }

    if (newCount < this.props.min) {
      newCount = this.props.min;
    } else if (newCount > this.props.max) {
      newCount = this.props.max;
    }

    this.setState({
      count: newCount,
      editable: false,
    }, this.onChange);
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
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  label: '',
  onChange: () => {},
};

export default Counter;
