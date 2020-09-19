import React from 'react';
import ReactModal from 'react-modal';
import ShortcutCaptureForm from './shortcut-capture-form';
import CounterData from './counter-data';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';
import icons from './icons';

const INITIAL_VALIDITIES = {
  valueValidity: true,
  initialValidity: true,
  minValidity: true,
  maxValidity: true,
  stepValidity: true,
};

const REJECTION_REASON = {
  value: '- "Value" should be a safe integer.',
  initial: '- "Initial value" should be a safe integer.',
  min: '- "Minimum value" should be a safe integer.',
  max: '- "Maximum value" should be a safe integer.',
  step: '- "Counter step" should be a safe integer.',
};

class EditCountersModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '0',
      initial: '0',
      min: '0',
      max: `${Number.MAX_SAFE_INTEGER}`,
      step: '1',
      countUpShortcut: Shortcut.NONE,
      countDownShortcut: Shortcut.NONE,
      valueValidity: true,
      initialValidity: true,
      minValidity: true,
      maxValidity: true,
      stepValidity: true,
    };
  }

  handleModalAfterOpen = () => {
    if (!this.props.names || !this.props.names.length) {
      this.props.onCancel();
      return;
    }

    this.setState((state, props) => {
      const checkedCount = props.names.length;
      const firstCounter = new CounterData(props.counters[props.names[0]]);
      for (let index = 1; index < checkedCount; index += 1) {
        const currentCounter = props.counters[props.names[index]];
        for (const counterProp of CounterData.MANIPULATOR_PROPS) {
          if (firstCounter[counterProp] !== currentCounter[counterProp]) {
            firstCounter[counterProp] = '';
          }
        }
        firstCounter.shortcuts = firstCounter.shortcuts.getDifferenceMarked(currentCounter.shortcuts);
      }

      const { value, initial, min, max, step, shortcuts } = firstCounter;
      return {
        value, initial, min, max, step,
        countUpShortcut: shortcuts.countUp,
        countDownShortcut: shortcuts.countDown,
        ...INITIAL_VALIDITIES,
      };
    });
  }

  handleValueChange = (event) => {
    this.setState({
      value: event.target.value,
      valueValidity: event.target.validity.valid,
    });
  }

  handleInitialChange = (event) => {
    this.setState({
      initial: event.target.value,
      initialValidity: event.target.validity.valid,
    });
  }

  handleMinChange = (event) => {
    this.setState({
      min: event.target.value,
      minValidity: event.target.validity.valid,
    });
  }

  handleMaxChange = (event) => {
    this.setState({
      max: event.target.value,
      maxValidity: event.target.validity.valid,
    });
  }

  handleStepChange = (event) => {
    this.setState({
      step: event.target.value,
      stepValidity: event.target.validity.valid,
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
    if (!this.state.valueValidity) {
      rejectionReasons.push(REJECTION_REASON.value);
    }
    if (!this.state.initialValidity) {
      rejectionReasons.push(REJECTION_REASON.initial);
    }
    if (!this.state.minValidity) {
      rejectionReasons.push(REJECTION_REASON.min);
    }
    if (!this.state.maxValidity) {
      rejectionReasons.push(REJECTION_REASON.max);
    }
    if (!this.state.stepValidity) {
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
              type="number"
              inputMode="numeric"
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.value}
              onChange={this.handleValueChange}
            />
          </li>
          <li>
            <label>
              Initial value (Integer)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.initial}
              onChange={this.handleInitialChange}
            />
          </li>
          <li>
            <label>
              Minimum value (Integer)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.min}
              onChange={this.handleMinChange}
            />
          </li>
          <li>
            <label>
              Maximum value (Integer)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.max}
              onChange={this.handleMaxChange}
            />
          </li>
          <li>
            <label>
              Count step (Positive integer)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.step}
              onChange={this.handleStepChange}
            />
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
