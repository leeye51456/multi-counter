import React from 'react';
import ReactModal from 'react-modal';
import Counter from './counter';
import AddNewCounterModal from './add-new-counter-modal';
import EditCountersModal from './edit-counters-modal';
import { EditModeContext } from './contexts';

ReactModal.setAppElement('#root');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counterOrder: [],
      counterIndexesByName: {},
      counters: {},
      checkedCounters: [],
      modal: '',
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
        this.updateCounters([newCounterData]);
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

  updateCounters = (updatedCounters) => {
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
    }, this.updateCheckedCounters);
  }

  updateCheckedCounters = () => {
    this.setState((state) => {
      const checkedCounters = state.counterOrder.filter((name) => state.counters[name].checked);
      return { checkedCounters };
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
    }, this.updateCheckedCounters);
  }

  openOrCloseModal = (willOpen, modal) => {
    this.setState({ modal: willOpen ? modal : '' });
  }

  isEveryCounterChecked = () => {
    return this.state.checkedCounters.length === this.state.counterOrder.length;
  }

  handleResetClick = () => {
    const countersToUpdate = [];
    for (const name of this.state.counterOrder) {
      const counterData = this.state.counters[name];
      if (counterData.checked) {
        countersToUpdate.push({
          name,
          checked: false,
          value: counterData.initial,
        });
      }
    }
    this.updateCounters(countersToUpdate);
    this.setState({ isEditModeEnabled: false });
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
    }, this.updateCheckedCounters);
  }

  handleNewCounterClick = () => {
    this.openOrCloseModal(true, 'AddNewCounterModal');
  }

  handleNewCounterModalSubmit = (param) => {
    // TODO - Validate param
    // TODO - if `value` is not a number, assign `initial` to `value`
    this.appendCounter({
      ...param,
      value: param.initial,
    });

    this.openOrCloseModal(false);
  }

  handleEditCountersClick = () => {
    if (this.state.checkedCounters.length > 0) {
      this.openOrCloseModal(true, 'EditCountersModal');
    }
  }

  handleEditCountersModalSubmit = (param) => {
    // TODO - Validate param
    // TODO - if `value` is not a number, assign `initial` to `value`
    const { initial, min, max, step } = param;
    const counters = param.names.map((name) => ({ name, initial, min, max, step }));
    this.updateCounters(counters);
    this.openOrCloseModal(false);
    this.checkOrUncheckAll(false);
    this.setState({ isEditModeEnabled: false });
  }

  handleModalCancel = () => {
    this.openOrCloseModal(false);
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
              <button
                type="button"
                onClick={this.handleEditCountersClick}
              >
                Edit Selected Counters
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.handleResetClick}
              >
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
          existingNames={this.state.counterOrder}
          isOpen={this.state.modal === 'AddNewCounterModal'}
          onSubmit={this.handleNewCounterModalSubmit}
          onCancel={this.handleModalCancel}
        />

        <EditCountersModal
          counters={this.state.counters}
          names={this.state.checkedCounters}
          isOpen={this.state.modal === 'EditCountersModal'}
          onSubmit={this.handleEditCountersModalSubmit}
          onCancel={this.handleModalCancel}
        />
      </div>
    );
  }
}

export default App;
