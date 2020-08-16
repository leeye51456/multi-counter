import React from 'react';
import ReactModal from 'react-modal';

class EditCountersModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initial: '0',
      min: '0',
      max: `${Number.MAX_SAFE_INTEGER}`,
      step: '1',
    };
  }

  handleModalAfterOpen = () => {
    if (!this.props.names || !this.props.names.length) {
      this.props.onCancel();
      return;
    }

    this.setState((state, props) => {
      const { initial, min, max, step } = props.counters[props.names[0]];
      return { initial, min, max, step };
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

  handleSubmitClick = () => {
    let { initial, min, max, step } = this.state;
    [initial, min, max, step] = [initial, min, max, step].map((value) => Number.parseInt(value, 10));

    if ([initial, min, max, step].map((value) => Number.isSafeInteger(value)).includes(false)) {
      return;
    } else if (step <= 0) {
      return;
    } else if (min > max) {
      return;
    }

    this.props.onSubmit({ names: this.props.names, initial, min, max, step });
  }

  handleCancelClick = () => {
    this.props.onCancel();
  }

  render = () => {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.handleModalAfterOpen}
        contentLabel="Edit Counters"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        // shouldReturnFocusAfterClose={false}
      >
        <h1>
          Edit Counters
        </h1>
        <form>
          <ul>
            <li>
              <label>
                Counters: {this.props.names.join(', ')}
              </label>
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
          <ul>
            <li>
              <button
                type="button"
                onClick={this.handleSubmitClick}
              >
                Apply
              </button>
            </li>
            <li>
              <button
                type="reset"
                onClick={this.handleCancelClick}
              >
                Cancel
              </button>
            </li>
          </ul>
        </form>
      </ReactModal>
    );
  }
}

export default EditCountersModal;
