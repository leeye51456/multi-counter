import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { GlobalEditModeContext } from './contexts';
import { NO_OP } from './utils';
import icons from './icons';

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

  handleCounterClick = (event) => {
    const isGlobalEditModeEnabled = this.context;
    if (isGlobalEditModeEnabled) {
      this.props.onChange({
        checked: !this.props.checked,
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

  handleEditClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onEditClick(this.props.name);
  }

  handleCountDownClick = (event) => {
    event.preventDefault();
    this.countDown();
  }

  handleCountUpClick = (event) => {
    event.preventDefault();
    this.countUp();
  }

  render = () => {
    const isGlobalEditModeEnabled = this.context;
    const { t } = this.props;

    const classes = {
      counter: classNames('counter', { 'counter-checked': this.props.checked }),
      normalCounterButton: classNames('button-with-icon', { 'force-hidden': isGlobalEditModeEnabled }),
      editCounterButton: classNames('button-with-icon-text', { 'force-hidden': !isGlobalEditModeEnabled }),
    };

    return (
      <div
        className={classes.counter}
        onClick={this.handleCounterClick}
      >
        <ul>
          <li className="counter-row">
            <span className="counter-label">
              {this.props.name}
            </span>
          </li>

          <li className="counter-row">
            <span className="counter-value">
              {this.props.value}
            </span>

            <button
              type="button"
              onClick={this.handleCountDownClick}
              className={classes.normalCounterButton}
            >
              <img src={icons.subtract} alt={t('counter.count-down')} />
            </button>

            <button
              type="button"
              onClick={this.handleCountUpClick}
              className={classes.normalCounterButton}
            >
              <img src={icons.add} alt={t('counter.count-up')} />
            </button>

            <button
              type="button"
              onClick={this.handleEditClick}
              className={classes.editCounterButton}
            >
              <img src={icons.edit} alt="" />
              <span>
                {t('counter.edit')}
              </span>
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
  onChange: NO_OP,
  onEditClick: NO_OP,
};

export default withTranslation()(Counter);
