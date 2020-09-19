import React from 'react';
import ReactModal from 'react-modal';
import escapeStringRegexp from 'escape-string-regexp';
import ShortcutCaptureForm from './shortcut-capture-form';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';
import icons from './icons';

const REJECTION_REASON = {
  name: '- "Name" should not be empty or duplicated.',
  range: '- "Initial/Maximum/Minimum value" should be safe integers, where (Minimum value) <= (Initial value) <= (Maximum value).',
  step: '- "Counter step" should be a safe integer.',
};

const defaultState = {
  name: '',
  initial: '0',
  min: '0',
  max: `${Number.MAX_SAFE_INTEGER}`,
  step: '1',
  countUpShortcut: Shortcut.NONE,
  countDownShortcut: Shortcut.NONE,
  nameValidity: true,
  rangeValidity: true,
  stepValidity: true,
};

class AddNewCounterModal extends React.Component {
  constructor(props) {
    super(props);

    this.initialRef = React.createRef();
    this.minRef = React.createRef();
    this.maxRef = React.createRef();

    this.state = defaultState;
  }

  handleModalAfterOpen = () => {
    if (!this.props.existingNames) {
      this.props.onCancel();
      return;
    }

    this.setState({
      ...defaultState,
      namePattern: `^(?!(${this.props.existingNames.map((value) => escapeStringRegexp(value)).join('|')})$).+$`,
    });
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
      nameValidity: event.target.validity.valid,
    });
  }

  handleRangeChange = () => {
    const initialValidity = this.initialRef.current.validity.valid;
    const minValidity = this.minRef.current.validity.valid;
    const maxValidity = this.maxRef.current.validity.valid;
    this.setState({
      initial: this.initialRef.current.value,
      min: this.minRef.current.value,
      max: this.maxRef.current.value,
      rangeValidity: initialValidity && minValidity && maxValidity,
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
    if (!this.state.nameValidity) {
      rejectionReasons.push(REJECTION_REASON.name);
    }
    if (!this.state.rangeValidity) {
      rejectionReasons.push(REJECTION_REASON.range);
    }
    if (!this.state.stepValidity) {
      rejectionReasons.push(REJECTION_REASON.step);
    }

    if (rejectionReasons.length > 0) {
      window.alert('Some values are invalid!\n' + rejectionReasons.join('\n'));
      return;
    }

    let {name, initial, min, max, step} = this.state;
    [initial, min, max, step] = [initial, min, max, step].map((value) => Number.parseInt(value, 10));
    const { countUpShortcut: countUp, countDownShortcut: countDown } = this.state;
    const shortcuts = new ShortcutCollection({ countUp, countDown });

    this.props.onSubmit({ name, initial, min, max, step, shortcuts });
  }

  handleCancelClick = (event) => {
    event.preventDefault();
    this.props.onCancel();
  }

  render = () => {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.handleModalAfterOpen}
        onRequestClose={this.props.onCancel}
        contentLabel="Add New Counter"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h1>
          Add New Counter
        </h1>

        <hr />

        <ul>
          <li>
            <label>
              Name
            </label>
            <input
              type="text"
              required={true}
              pattern={this.state.namePattern}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </li>
          <li>
            <label>
              Initial value (Integer)
            </label>
            <input
              ref={this.initialRef}
              type="number"
              inputMode="numeric"
              min={this.state.min}
              max={this.state.max}
              step={1}
              value={this.state.initial}
              onChange={this.handleRangeChange}
            />
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
              max={this.state.initial}
              step={1}
              value={this.state.min}
              onChange={this.handleRangeChange}
            />
          </li>
          <li>
            <label>
              Maximum value (Integer)
            </label>
            <input
              ref={this.maxRef}
              type="number"
              inputMode="numeric"
              min={this.state.initial}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.max}
              onChange={this.handleRangeChange}
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
              <img src={icons.check} alt="Add" />
            </button>
          </li>
        </ul>

      </ReactModal>
    );
  }
}

export default AddNewCounterModal;
