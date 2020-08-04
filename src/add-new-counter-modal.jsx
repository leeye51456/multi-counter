import React from 'react';
import ReactModal from 'react-modal';

class AddNewCounterModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      initial: '0',
      min: '0',
      max: `${Number.MAX_SAFE_INTEGER}`,
      step: '1',
    };
  }

  handleModalAfterOpen = () => {
    this.setState({
      name: '',
      initial: '0',
      min: '0',
      max: `${Number.MAX_SAFE_INTEGER}`,
      step: '1',
    });
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

  handleSubmitClick = () => {
    let {name, initial, min, max, step} = this.state;
    [initial, min, max, step] = [initial, min, max, step].map((value) => Number.parseInt(value, 10));

    if ([initial, min, max, step].filter((value) => Number.isSafeInteger(value)).includes(false)) {
      return;
    } else if (step <= 0) {
      return;
    } else if (min > max) {
      return;
    } else if (this.props.existingNames.includes(name)) {
      return;
    }

    this.props.onSubmit({name, initial, min, max, step});
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
      >
        <h1>
          Add New Counter
        </h1>
        <form>
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
          <ul>
            <li>
              <button
                type="button"
                onClick={this.handleSubmitClick}
              >
                Add
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

export default AddNewCounterModal;
