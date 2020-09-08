import React from 'react';
import ReactModal from 'react-modal';
import ShortcutCaptureForm from './shortcut-capture-form';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';
import icons from './icons';

const defaultState = {
  name: '',
  initial: '0',
  min: '0',
  max: `${Number.MAX_SAFE_INTEGER}`,
  step: '1',
  countUpShortcut: Shortcut.NONE,
  countDownShortcut: Shortcut.NONE,
};

class AddNewCounterModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
  }

  handleModalAfterOpen = () => {
    this.setState(defaultState);
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  }

  handleInitialChange = (event) => {
    this.setState({
      initial: event.target.value,
    });
  }

  handleMinChange = (event) => {
    this.setState({
      min: event.target.value,
    });
  }

  handleMaxChange = (event) => {
    this.setState({
      max: event.target.value,
    });
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

  handleSubmitClick = () => {
    let {name, initial, min, max, step} = this.state;
    [initial, min, max, step] = [initial, min, max, step].map((value) => Number.parseInt(value, 10));

    // TODO - Display what form is invalid.
    if ([initial, min, max, step].map((value) => Number.isSafeInteger(value)).includes(false)) {
      // FIXME - Show what is invalid exactly.
      window.alert('Initial value, minimum value, maximum value, and counter step should be safe integers.');
      return;
    } else if (step <= 0) {
      window.alert('Counter step should be a positive integer.');
      return;
    } else if (min > max) {
      window.alert('Mininum value should be lesser than maximum value.');
      return;
    } else if (name === '' || this.props.existingNames.includes(name)) {
      // FIXME - Show what is invalid exactly.
      window.alert('Name should not be empty or duplicated.');
      return;
    }

    const { countUpShortcut: countUp, countDownShortcut: countDown } = this.state;
    const shortcuts = new ShortcutCollection({ countUp, countDown });

    this.props.onSubmit({ name, initial, min, max, step, shortcuts });
  }

  handleCancelClick = () => {
    this.props.onCancel();
  }

  render = () => {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.handleModalAfterOpen}
        contentLabel="Add New Counter"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{ overlay: { zIndex: 100 }}}
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
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </li>
          <li>
            <label>
              Initial value (Integer)
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="-?\\d*"
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
              pattern="-?\\d*"
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
              pattern="-?\\d*"
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
              pattern="[1-9]\\d*"
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
              className="action-button"
            >
              <img src={icons.close} alt="Cancel" />
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={this.handleSubmitClick}
              className="action-button"
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
