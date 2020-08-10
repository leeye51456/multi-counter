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
      counterOrder: [],
      counterIndexesByName: {},
      counters: {},
      modals: {
        isNewCounterOpen: false,
      },
      isEditModeEnabled: false,
    };
  }

  componentDidMount = () => {
    this.appendCounter({ name: 'Sample Counter' });
  }

  getNewCounter = (counterData) => {
    return (
      <Counter
        {...counterData}
        key={counterData.name}
      />
    );
  }

  appendCounter = (counterData) => {
    this.setState((state) => {
      const { name } = counterData;
      counterData.onChange = (newCounterData) => {
        this.updateCounter([newCounterData]);
      };

      const newCounter = this.getNewCounter(counterData);
      const { value, initial, min, max, step, checked, onChange } = newCounter.props;
      const actualCounterData = { value, initial, min, max, step, name, checked, onChange };

      const counters = {
        ...state.counters,
        [name]: actualCounterData,
      };

      const counterOrder = state.counterOrder.slice();
      const counterIndexesByName = {
        ...state.counterIndexesByName,
        [name]: counterOrder.length,
      };
      counterOrder.push(name);

      return {
        counterOrder,
        counterIndexesByName,
        counters,
      };
    });
  }

  updateCounter = (updatedCounters) => {
    this.setState((state) => {
      const counters = { ...state.counters };

      for (const newCounterData of updatedCounters) {
        const { name } = newCounterData;
        const targetComponentIndex = state.counterIndexesByName[name];
        if (typeof targetComponentIndex !== 'number') {
          return;
        }

        counters[name] = {
          ...counters[name],
          ...newCounterData,
        };
      }

      return { counters };
    });
  }

  checkOrUncheckAll = (checked) => {
    this.setState((state) => {
      const counters = { ...state.counters };

      for (const name of state.counterOrder) {
        if (counters[name].checked !== checked) {
          counters[name] = {
            ...counters[name],
            checked,
          };
        }
      }

      return { counters };
    });
  }

  openOrCloseNewCounterModal = (isOpen) => {
    const newModalState = {...this.state.modals};
    newModalState.isNewCounterOpen = isOpen;
    this.setState({
      modals: newModalState,
    });
  }

  isEveryCounterChecked = () => {
    const { counters } = this.state;
    for (const name of this.state.counterOrder) {
      if (!counters[name].checked) {
        return false;
      }
    }
    return true;
  }

  handleRemoveClick = () => {
    this.setState((state) => {
      const counterIndexesByName = { ...state.counterIndexesByName };
      const counters = { ...state.counters };

      const counterOrder = state.counterOrder.filter((name) => {
        const checked = counters[name].checked;
        if (checked) {
          delete counterIndexesByName[name];
          delete counters[name];
        }
        return !checked;
      });

      return {
        counterOrder,
        counterIndexesByName,
        counters,
        isEditModeEnabled: false,
      }
    });
  }

  handleNewCounterClick = () => {
    this.openOrCloseNewCounterModal(true);
  }

  handleNewCounterModalSubmit = (param) => {
    // TODO - Validate param
    // TODO - if `value` is not a number, assign `initial` to `value`
    this.appendCounter({
      ...param,
      value: param.initial,
    });

    this.openOrCloseNewCounterModal(false);
  }

  handleNewCounterModalCancel = () => {
    this.openOrCloseNewCounterModal(false);
  }

  handleEditCounterListClick = () => {
    this.setState({ isEditModeEnabled: true });
  }

  handleExitEditModeClick = () => {
    this.checkOrUncheckAll(false);
    this.setState({ isEditModeEnabled: false });
  }

  handleSelectAllClick = () => {
    this.checkOrUncheckAll(!this.isEveryCounterChecked());
  }

  render = () => {
    const isEditModeEnabled = this.state.isEditModeEnabled;
    const counterComponents = this.state.counterOrder.slice().map((name) => {
      return this.getNewCounter(this.state.counters[name]);
    });
    const selectAllLabel = this.isEveryCounterChecked() ? 'Unselect All' : 'Select All';

    return (
      <div className="App">
        <header>
          {/* TODO - Add header */}
        </header>

        <section>
          <EditModeContext.Provider
            value={this.state.isEditModeEnabled}
          >
            {counterComponents}
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
              <button
                type="button"
                onClick={this.handleSelectAllClick}
              >
                {selectAllLabel}
              </button>
            </li>
            <li>
              <button type="button">
                Reset Selected Counters
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.handleRemoveClick}
              >
                Remove Selected Counters
              </button>
            </li>
          </ul>
        </aside>

        <AddNewCounterModal
          existingNames={Object.keys(this.state.counters)}
          isOpen={this.state.modals.isNewCounterOpen}
          onSubmit={this.handleNewCounterModalSubmit}
          onCancel={this.handleNewCounterModalCancel}
        />
      </div>
    );
  }
}

export default App;
