import React from 'react';
import ReactModal from 'react-modal';
import Counter from './counter';
import AddNewCounterModal from './add-new-counter-modal';
import { EditModeContext } from './contexts';

ReactModal.setAppElement('#root');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counterComponents: [],
      counterComponentIndexesByName: {},
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

  getNewCounter = (name, counterData) => {
    return (
      <Counter
        key={name}
        value={counterData.value}
        initial={counterData.initial}
        min={counterData.min}
        max={counterData.max}
        step={counterData.step}
        name={name}
        checked={counterData.checked}
        onChange={counterData.onChange}
      />
    );
  }

  appendCounter = (param) => {
    // TODO - if `value` is not a number, assign `initial` to `value`
    const name = param.name;
    param.onChange = (newData) => {
      this.updateCounter(name, newData);
    };

    const counterComponents = this.state.counterComponents.slice();
    const counterComponentIndexesByName = {...this.state.counterComponentIndexesByName};
    const counterData = {...this.state.counterData};

    const newCounter = this.getNewCounter(name, param);
    counterData[name] = {
      value: newCounter.props.value,
      initial: newCounter.props.initial,
      min: newCounter.props.min,
      max: newCounter.props.max,
      step: newCounter.props.step,
      name: newCounter.props.name,
      checked: newCounter.props.checked,
      onChange: newCounter.props.onChange,
    };
    counterComponentIndexesByName[name] = counterComponents.length;
    counterComponents.push(newCounter);
    this.setState({
      counterComponents,
      counterComponentIndexesByName,
      counterData,
    });
  }

  updateCounter = (name, newCounterDatum) => {
    const counterComponents = this.state.counterComponents.slice();
    const counterDatum = {...this.state.counterData[name]};
    const targetComponentIndex = this.state.counterComponentIndexesByName[name];
    if (typeof targetComponentIndex !== 'number') {
      return;
    }

    counterDatum.value = newCounterDatum.value;
    counterDatum.checked = newCounterDatum.checked;

    counterComponents[targetComponentIndex] = this.getNewCounter(name, counterDatum);

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
    const isEditModeEnabled = this.state.isEditModeEnabled;

    return (
      <div className="App">
        <header>
          {/* TODO - Add header */}
        </header>

        <section>
          <EditModeContext.Provider
            value={this.state.isEditModeEnabled}
          >
            {this.state.counterComponents}
          </EditModeContext.Provider>
        </section>

        <aside>
          <ul style={{display: isEditModeEnabled ? 'none' : 'block'}}>
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

          <ul style={{display: isEditModeEnabled ? 'block' : 'none'}}>
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
