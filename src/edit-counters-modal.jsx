import React from 'react';
import ReactModal from 'react-modal';

const counterProps = ['initial', 'min', 'max', 'step'];

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
      const checkedCount = props.names.length;
      const firstCounter = { ...props.counters[props.names[0]] };
      const differentProps = [];
      const counterPropsCount = counterProps.length;
      for (let index = 1; index < checkedCount; index += 1) {
        const currentCounter = props.counters[props.names[index]];
        for (const counterProp of counterProps) {
          if (firstCounter[counterProp] !== currentCounter[counterProp]) {
            firstCounter[counterProp] = '';
            differentProps.push(counterProp);
          }
        }
        if (differentProps.length === counterPropsCount) {
          break;
        }
      }
      const { initial, min, max, step } = firstCounter;
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
    const { initial, min, max, step } = this.state;
    const submitArgument = { initial, min, max, step };
    for (const counterProp of counterProps) {
      if (submitArgument[counterProp] === '') {
        delete submitArgument[counterProp];
      } else {
        submitArgument[counterProp] = Number.parseInt(submitArgument[counterProp], 10);
      }
    }

    if (Object.values(submitArgument).map((value) => Number.isSafeInteger(value)).includes(false)) {
      return;
    } else if (submitArgument.step === 0 || (submitArgument.step && submitArgument.step < 0)) {
      return;
    }
    // TODO - re-implement min/max validation check (be careful of empty values)

    this.props.onSubmit({ names: this.props.names, ...submitArgument });
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

      </ReactModal>
    );
  }
}

export default EditCountersModal;
