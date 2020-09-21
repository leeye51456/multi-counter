import React from 'react';
import ReactModal from 'react-modal';
import ShortcutCaptureForm from './shortcut-capture-form';
import CounterData from './counter-data';
import NumberInput from './number-input';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';
import { insertCommas, numbersWithCommas } from './utils';
import icons from './icons';

const rejectionReasonString = {
  value: '- "Value" should be a safe integer within the correct range.',
  initial: '- "Initial value" should be a safe integer within the correct range.',
  min: '- "Minimum value" should be a safe integer within the correct range.',
  max: '- "Maximum value" should be a safe integer within the correct range.',
  step: '- "Counter step" should be a positive safe integer.',
};

class EditCountersModal extends React.Component {
  constructor(props) {
    super(props);

    this.bindNumberInputEventHandler(['value', 'initial', 'min', 'max'], ['change', 'invert', 'reset']);
    this.bindNumberInputEventHandler(['step'], ['change', 'reset']);

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

  bindNumberInputEventHandler = (names, types) => {
    for (const name of names) {
      const sentenceCasedName = name[0].toUpperCase() + name.substring(1);
      for (const type of types) {
        const sentenceCasedType = type[0].toUpperCase() + type.substring(1);
        const primitiveFunctionName = `handleNumberInput${sentenceCasedType}`;
        if (this[primitiveFunctionName]) {
          this[`handle${sentenceCasedName}${sentenceCasedType}`] = this[primitiveFunctionName].bind(this, name);
        }
      }
    }
  }

  getActualLowerBound = (state) => {
    return state.min === '' ? state.defaults.rangeLowerBound : state.min;
  }
  getActualUpperBound = (state) => {
    return state.max === '' ? state.defaults.rangeUpperBound : state.max;
  }
  getActualMaxOfMin = (state) => {
    return Math.min(
      ...[state.max].filter((value) => value !== ''),
      state.initial !== '' || state.value !== ''
        ? Math.min(state.initial, state.value)
        : state.defaults.minPropUpperBound
    );
  }
  getActualMinOfMax = (state) => {
    return Math.max(
      ...[state.min].filter((value) => value !== ''),
      state.initial !== '' || state.value !== ''
        ? Math.max(state.initial, state.value)
        : state.defaults.maxPropLowerBound
    );
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
        for (const counterProp of CounterData.manipulatorProps) {
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

  handleNumberInputChange = (stateName, event) => {
    this.setState({ [stateName]: event.target.value });
  }
  handleNumberInputInvert = (stateName) => {
    this.setState((state) => {
      if (!isNaN(parseInt(state[stateName], 10))) {
        return { [stateName]: -state[stateName] };
      }
    });
  }
  handleNumberInputReset = (stateName) => {
    this.setState({ [stateName]: '' });
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
      rejectionReasons.push(rejectionReasonString.value);
    }
    if (!this.initialRef.current.validity.valid) {
      rejectionReasons.push(rejectionReasonString.initial);
    }
    if (!this.minRef.current.validity.valid) {
      rejectionReasons.push(rejectionReasonString.min);
    }
    if (!this.maxRef.current.validity.valid) {
      rejectionReasons.push(rejectionReasonString.max);
    }
    if (!this.stepRef.current.validity.valid) {
      rejectionReasons.push(rejectionReasonString.step);
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
    for (const counterProp of CounterData.manipulatorProps) {
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
    const counterNames = this.props.names.map((name) => (
      <li key={name}>
        {name}
      </li>
    ));

    const valueMin = this.getActualLowerBound(this.state);
    const valueMax = this.getActualUpperBound(this.state);
    const maxOfMin = this.getActualMaxOfMin(this.state);
    const minOfMax = this.getActualMinOfMax(this.state);

    const valueMinWithCommas = insertCommas(valueMin);
    const valueMaxWithCommas = insertCommas(valueMax);

    const valueConstraintString = (
      valueMin <= valueMax
      ? `${valueMinWithCommas} ... ${valueMaxWithCommas}`
      : 'Unchangeable (Leave blank)'
    );

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
            <ul className="modal-counter-names">
              {counterNames}
            </ul>
          </li>
          <li>
            <label>
              Value (Integer)
            </label>
            <NumberInput
              ref={this.valueRef}
              min={valueMin}
              max={valueMax}
              step={1}
              value={this.state.value}
              onChange={this.handleValueChange}
              onInvert={this.handleValueInvert}
              onReset={this.handleValueReset}
            />
            <p className="modal-input-constraint">
              {valueConstraintString}
            </p>
          </li>
          <li>
            <label>
              Initial value (Integer)
            </label>
            <NumberInput
              ref={this.initialRef}
              min={valueMin}
              max={valueMax}
              step={1}
              value={this.state.initial}
              onChange={this.handleInitialChange}
              onInvert={this.handleInitialInvert}
              onReset={this.handleInitialReset}
            />
            <p className="modal-input-constraint">
              {valueConstraintString}
            </p>
          </li>
          <li>
            <label>
              Minimum value (Integer)
            </label>
            <NumberInput
              ref={this.minRef}
              min={Number.MIN_SAFE_INTEGER}
              max={maxOfMin}
              step={1}
              value={this.state.min}
              onChange={this.handleMinChange}
              onInvert={this.handleMinInvert}
              onReset={this.handleMinReset}
            />
            <p className="modal-input-constraint">
              {numbersWithCommas.MIN_SAFE_INTEGER} ... {insertCommas(maxOfMin)}
            </p>
          </li>
          <li>
            <label>
              Maximum value (Integer)
            </label>
            <NumberInput
              ref={this.maxRef}
              min={minOfMax}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.max}
              onChange={this.handleMaxChange}
              onInvert={this.handleMaxInvert}
              onReset={this.handleMaxReset}
            />
            <p className="modal-input-constraint">
              {insertCommas(minOfMax)} ... {numbersWithCommas.MAX_SAFE_INTEGER}
            </p>
          </li>
          <li>
            <label>
              Count step (Positive integer)
            </label>
            <NumberInput
              ref={this.stepRef}
              min={1}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.step}
              onChange={this.handleStepChange}
              onReset={this.handleStepReset}
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
