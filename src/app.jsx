import React from 'react';
import ReactModal from 'react-modal';
import Counter from './counter';
import AddNewCounterModal from './add-new-counter-modal';

ReactModal.setAppElement('#root');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counterComponents: [],
      counterData: {},
      modals: {
        isNewCounterOpen: false,
      },
      isEditModeEnabled: false,
    };
  }

  componentDidMount = () => {
    this.appendCounter({name: 'Sample Counter'});
  }

  appendCounter = ({value, initial, min, max, step, name}) => {
    // TODO - if `value` is not a number, assign `initial` to `value`
    const counterComponents = this.state.counterComponents.slice();
    const counterData = {...this.state.counterData};
    const handleCounterChange = (newValue) => {
      this.updateCounter(name, newValue);
    };
    const newCounter = (
      <Counter
        key={name}
        value={value}
        initial={initial}
        min={min}
        max={max}
        step={step}
        name={name}
        onChange={handleCounterChange}
      />
    );
    counterData[name] = {
      value: newCounter.props.value,
      initial: newCounter.props.initial,
      min: newCounter.props.min,
      max: newCounter.props.max,
      step: newCounter.props.step,
      name: newCounter.props.name,
    };
    counterComponents.push(newCounter);
    this.setState({
      counterComponents,
      counterData,
    });
  }

  updateCounter = (name, newCounterValue) => {
    const counterComponents = this.state.counterComponents.slice();
    const counterDatum = {...this.state.counterData[name]};
    const counterComponentIndex = counterComponents.findIndex((component) => component.props.name === name);
    if (counterComponentIndex < 0) {
      return;
    }

    counterDatum.value = newCounterValue;

    const newCounter = (
      <Counter
        key={name}
        value={counterDatum.value}
        initial={counterDatum.initial}
        min={counterDatum.min}
        max={counterDatum.max}
        step={counterDatum.step}
        name={counterDatum.name}
        onChange={counterComponents[counterComponentIndex].props.onChange}
      />
    );
    counterComponents[counterComponentIndex] = newCounter;

    const counterData = {...this.state.counterData};
    counterData[name] = counterDatum;

    this.setState({
      counterComponents,
      counterData,
    });
  }

  handleNewCounterClick = () => {
    const newModalState = {...this.state.modals};
    newModalState.isNewCounterOpen = true;
    this.setState({
      modals: newModalState,
    });
  }

  handleNewCounterModalSubmit = (param) => {
    const {name, initial, min, max, step} = param;
    this.appendCounter({
      initial, min, max, step, name,
      value: initial,
    });

    this.closeNewCounterModal();
  }

  closeNewCounterModal = () => {
    const newModalState = {...this.state.modals};
    newModalState.isNewCounterOpen = false;
    this.setState({
      modals: newModalState,
    });
  }

  handleEditCounterListClick = () => {
    this.setState({isEditModeEnabled: true});
  }

  handleExitEditModeClick = () => {
    this.setState({isEditModeEnabled: false});
  }

  render = () => {
    return (
      <div className="App">
        <header>
          {/* TODO - Add header */}
        </header>

        <section>
          {this.state.counterComponents}
        </section>

        <aside>
          <ul style={{display: this.state.isEditModeEnabled ? 'none' : 'block'}}>
            <li>
              <button
                type="button"
                onClick={this.handleNewCounterClick}
              >
                Add New Counter
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.handleEditCounterListClick}
              >
                Edit Counter List
              </button>
            </li>
          </ul>

          <ul style={{display: this.state.isEditModeEnabled ? 'block' : 'none'}}>
            <li>
              <button
                type="button"
                onClick={this.handleExitEditModeClick}
              >
                Exit Edit Mode
              </button>
            </li>
            <li>
              <button type="button">
                Select All
              </button>
            </li>
            <li>
              <button type="button">
                Reset Selected Counters
              </button>
            </li>
            <li>
              <button type="button">
                Remove Selected Counters
              </button>
            </li>
          </ul>
        </aside>

        <AddNewCounterModal
          existingNames={Object.keys(this.state.counterData)}
          isOpen={this.state.modals.isNewCounterOpen}
          onSubmit={this.handleNewCounterModalSubmit}
          onCancel={this.closeNewCounterModal}
        />
      </div>
    );
  }
}

export default App;