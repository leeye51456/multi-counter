import React from 'react';
import ReactModal from 'react-modal';
import ShortcutCaptureForm from './shortcut-capture-form';
import CounterData from './counter-data';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';
import { insertCommas, numbersWithCommas } from './utils';
import icons from './icons';

const REJECTION_REASON = {
  value: '- "Value" should be a safe integer within the correct range.',
  initial: '- "Initial value" should be a safe integer within the correct range.',
  min: '- "Minimum value" should be a safe integer within the correct range.',
  max: '- "Maximum value" should be a safe integer within the correct range.',
  step: '- "Counter step" should be a positive safe integer.',
};

class EditCountersModal extends React.Component {
  constructor(props) {
    super(props);

    this.valueRef = React.createRef();
    this.initialRef = React.createRef();
    this.minRef = React.createRef();
    this.maxRef = React.createRef();
    this.stepRef = React.createRef();

    this.state = {
      value: '0',
      initial: '0',
      min: '0',
      max: `${Number.MAX_SAFE_INTEGER}`,
      step: '1',
      defaults: {
        minPropUpperBound: Number.MAX_SAFE_INTEGER,
        maxPropLowerBound: Number.MIN_SAFE_INTEGER,
        rangeLowerBound: Number.MIN_SAFE_INTEGER,
        rangeUpperBound: Number.MAX_SAFE_INTEGER,
      },
      countUpShortcut: Shortcut.NONE,
      countDownShortcut: Shortcut.NONE,
    };
  }

  handleModalAfterOpen = () => {
    if (!this.props.names || !this.props.names.length) {
      this.props.onCancel();
      return;
    }

    this.setState((state, props) => {
      const checkedCount = props.names.length;
      const commonCounter = new CounterData(props.counters[props.names[0]]);
      let minPropUpperBound = Math.min(Number.MAX_SAFE_INTEGER, commonCounter.initial, commonCounter.value);
      let maxPropLowerBound = Math.max(Number.MIN_SAFE_INTEGER, commonCounter.initial, commonCounter.value);
      let rangeLowerBound = commonCounter.min;
      let rangeUpperBound = commonCounter.max;
      for (let index = 1; index < checkedCount; index += 1) {
        const currentCounter = props.counters[props.names[index]];
        minPropUpperBound = Math.min(minPropUpperBound, currentCounter.initial, currentCounter.value);
        maxPropLowerBound = Math.max(maxPropLowerBound, currentCounter.initial, currentCounter.value);
        rangeLowerBound = Math.max(rangeLowerBound, currentCounter.min);
        rangeUpperBound = Math.min(rangeUpperBound, currentCounter.max);
        for (const counterProp of CounterData.MANIPULATOR_PROPS) {
          if (commonCounter[counterProp] !== currentCounter[counterProp]) {
            commonCounter[counterProp] = '';
          }
        }
        commonCounter.shortcuts = commonCounter.shortcuts.getDifferenceMarked(currentCounter.shortcuts);
      }

      const { value, initial, min, max, step, shortcuts } = commonCounter;
      return {
        value, initial, min, max, step,
        defaults: { minPropUpperBound, maxPropLowerBound, rangeLowerBound, rangeUpperBound },
        countUpShortcut: shortcuts.countUp,
        countDownShortcut: shortcuts.countDown,
      };
    });
  }

  handleValueChange = (event) => {
    this.setState({ value: event.target.value });
  }

  handleInitialChange = (event) => {
    this.setState({ initial: event.target.value });
  }

  handleMinChange = (event) => {
    this.setState({ min: event.target.value });
  }

  handleMaxChange = (event) => {
    this.setState({ max: event.target.value });
  }

  handleStepChange = (event) => {
    this.setState({
      step: event.target.value,
    });
  }

  handleCountUpShortcutChange = (shortcut) => {
    this.setState({
      countUpShortcut: shortcut,
    });
  }

  handleCountDownShortcutChange = (shortcut) => {
    this.setState({
      countDownShortcut: shortcut,
    });
  }

  handleSubmitClick = (event) => {
    event.preventDefault();

    const rejectionReasons = [];
    if (!this.valueRef.current.validity.valid) {
      rejectionReasons.push(REJECTION_REASON.value);
    }
    if (!this.initialRef.current.validity.valid) {
      rejectionReasons.push(REJECTION_REASON.initial);
    }
    if (!this.minRef.current.validity.valid) {
      rejectionReasons.push(REJECTION_REASON.min);
    }
    if (!this.maxRef.current.validity.valid) {
      rejectionReasons.push(REJECTION_REASON.max);
    }
    if (!this.stepRef.current.validity.valid) {
      rejectionReasons.push(REJECTION_REASON.step);
    }

    if (rejectionReasons.length > 0) {
      window.alert('Some values are invalid!\n' + rejectionReasons.join('\n'));
      return;
    }

    const { value, initial, min, max, step, countUpShortcut, countDownShortcut } = this.state;
    const submitArgument = {
      value, initial, min, max, step,
      shortcuts: new ShortcutCollection({
        countUp: countUpShortcut,
        countDown: countDownShortcut,
      }),
    };

    let isAllSafeInteger = true;
    for (const counterProp of CounterData.MANIPULATOR_PROPS) {
      if (submitArgument[counterProp] === '') {
        delete submitArgument[counterProp];
      } else {
        submitArgument[counterProp] = Number.parseInt(submitArgument[counterProp], 10);
        if (!Number.isSafeInteger(submitArgument[counterProp])) {
          isAllSafeInteger = false;
        }
      }
    }

    if (!isAllSafeInteger) {
      console.error('Something wrong!');
      return;
    }

    this.props.onSubmit({ names: this.props.names, ...submitArgument });
  }

  handleCancelClick = (event) => {
    event.preventDefault();
    this.props.onCancel();
  }

  render = () => {
    // TODO - Show commas in range text
    const initialAndValue = [this.state.initial, this.state.value];
    const valueMin = this.state.min === '' ? this.state.defaults.rangeLowerBound : this.state.min;
    const valueMax = this.state.max === '' ? this.state.defaults.rangeUpperBound : this.state.max;
    const maxOfMin = Math.min(
      ...[this.state.max].filter((value) => value !== ''),
      initialAndValue.some((value) => value !== '')
        ? Math.min(...initialAndValue)
        : this.state.defaults.minPropUpperBound
    );
    const minOfMax = Math.max(
      ...[this.state.min].filter((value) => value !== ''),
      initialAndValue.some((value) => value !== '')
        ? Math.max(...initialAndValue)
        : this.state.defaults.maxPropLowerBound
    );

    // FIXME - Add reset buttons
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.handleModalAfterOpen}
        onRequestClose={this.props.onCancel}
        contentLabel="Edit Counters"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h1>
          Edit Counters
        </h1>

        <hr />

        <ul>
          <li>
            <label>
              Name
            </label>
            <p className="modal-counter-names">
              {this.props.names.join(', ')}
            </p>
          </li>
          <li>
            <label>
              Value (Integer)
            </label>
            <input
              ref={this.valueRef}
              type="number"
              inputMode="numeric"
              min={valueMin}
              max={valueMax}
              step={1}
              value={this.state.value}
              onChange={this.handleValueChange}
            />
            <p className="modal-input-constraint">
              {insertCommas(valueMin)} ... {insertCommas(valueMax)}
            </p>
          </li>
          <li>
            <label>
              Initial value (Integer)
            </label>
            <input
              ref={this.initialRef}
              type="number"
              inputMode="numeric"
              min={valueMin}
              max={valueMax}
              step={1}
              value={this.state.initial}
              onChange={this.handleInitialChange}
            />
            <p className="modal-input-constraint">
              {insertCommas(valueMin)} ... {insertCommas(valueMax)}
            </p>
          </li>
          <li>
            <label>
              Minimum value (Integer)
            </label>
            <input
              ref={this.minRef}
              type="number"
              inputMode="numeric"
              min={Number.MIN_SAFE_INTEGER}
              max={maxOfMin}
              step={1}
              value={this.state.min}
              onChange={this.handleMinChange}
            />
            <p className="modal-input-constraint">
              {numbersWithCommas.MIN_SAFE_INTEGER} ... {insertCommas(maxOfMin)}
            </p>
          </li>
          <li>
            <label>
              Maximum value (Integer)
            </label>
            <input
              ref={this.maxRef}
              type="number"
              inputMode="numeric"
              min={minOfMax}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.max}
              onChange={this.handleMaxChange}
            />
            <p className="modal-input-constraint">
              {insertCommas(minOfMax)} ... {numbersWithCommas.MAX_SAFE_INTEGER}
            </p>
          </li>
          <li>
            <label>
              Count step (Positive integer)
            </label>
            <input
              ref={this.stepRef}
              type="number"
              inputMode="numeric"
              min={1}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.step}
              onChange={this.handleStepChange}
            />
            <p className="modal-input-constraint">
              1 ... {numbersWithCommas.MAX_SAFE_INTEGER}
            </p>
          </li>
        </ul>

        <hr />

        <h2>Shortcuts</h2>
        <ul>
          <li>
            <label>
              Count Up
            </label>
            <ShortcutCaptureForm
              shortcut={this.state.countUpShortcut}
              onChange={this.handleCountUpShortcutChange}
            />
          </li>
          <li>
            <label>
              Count Down
            </label>
            <ShortcutCaptureForm
              shortcut={this.state.countDownShortcut}
              onChange={this.handleCountDownShortcutChange}
            />
          </li>
        </ul>

        <hr />

        <ul className="modal-actions">
          <li>
            <button
              type="reset"
              onClick={this.handleCancelClick}
              className="action-button button-negative"
            >
              <img src={icons.close} alt="Cancel" />
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={this.handleSubmitClick}
              className="action-button button-positive"
            >
              <img src={icons.check} alt="Apply" />
            </button>
          </li>
        </ul>

      </ReactModal>
    );
  }
}

export default EditCountersModal;
