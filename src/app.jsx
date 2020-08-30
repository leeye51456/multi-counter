// FIXME - Implement classes for frequent objects and refactor overall codes

import React from 'react';
import ReactModal from 'react-modal';
import Counter from './counter';
import AddNewCounterModal from './add-new-counter-modal';
import EditCountersModal from './edit-counters-modal';
import { GlobalEditModeContext } from './contexts';
import CounterAction from './counter-action';
import CounterData from './counter-data';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';
import utils from './utils';

ReactModal.setAppElement('#root');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counterOrder: [],
      counterIndexesByName: {},
      counters: {},
      counterActionsByShortcutId: {},
      checkedCounters: [],
      modal: '',
      isEditModeEnabled: false,
    };
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.handleDocumentKeyDown);

    this.appendCounter(new CounterData({ name: 'Sample Counter' }));
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  handleDocumentKeyDown = (nativeEvent) => {
    if (utils.isTextForm(nativeEvent.target) || this.state.isEditModeEnabled || this.state.modal) {
      return;
    }

    const { key, code, shiftKey, ctrlKey, altKey, metaKey } = nativeEvent;
    const isInvalidKey = (
      ctrlKey || altKey || metaKey
      || (code && utils.includes(code.toLowerCase(), 'shift'))
      || utils.includes(key.toLowerCase(), 'shift')
    );
    if (isInvalidKey) {
      return;
    }

    const shortcutId = String(new Shortcut({ code, shiftKey, keyName: key }));
    const counterActions = this.state.counterActionsByShortcutId[shortcutId];
    if (!counterActions || !counterActions.length) {
      return;
    }

    const counters = counterActions.map((action) => action.execute({ ...this.state.counters[action.target] }));
    this.updateCounters(counters);
  }

  getUpdatedCounterActions = (counterActionsByShortcutId, { newCounterData, oldCounterData }) => {
    const shortcutActions = {
      countUp: CounterAction.PRESETS.GET_COUNTED_UP,
      countDown: CounterAction.PRESETS.GET_COUNTED_DOWN,
    };
    const oldShortcuts = oldCounterData && oldCounterData.shortcuts;
    const newShortcuts = newCounterData.shortcuts;

    counterActionsByShortcutId = { ...counterActionsByShortcutId };
    for (const shortcutName of ShortcutCollection.SHORTCUT_NAMES) {
      const oldShortcutId = oldShortcuts && String(oldShortcuts[shortcutName]);
      const newShortcutId = String(newShortcuts[shortcutName]);
      if (oldShortcutId && newShortcutId && oldShortcutId === newShortcutId) {
        continue;
      }

      const shouldOldShortcutBeRemoved = (
        oldShortcutId
        && newShortcuts[shortcutName] !== Shortcut.JUMBLED
        && newShortcuts[shortcutName] !== Shortcut.NO_CHANGE
      );
      if (shouldOldShortcutBeRemoved) {
        const counterActionsForShortcut = counterActionsByShortcutId[oldShortcutId];
        counterActionsByShortcutId[oldShortcutId] = counterActionsForShortcut.filter((action) => (
          action.target !== oldCounterData.name
          || action.execute !== shortcutActions[shortcutName]
        ));
        if (counterActionsByShortcutId[oldShortcutId].length === 0) {
          delete counterActionsByShortcutId[oldShortcutId];
        }
      }

      if (newShortcutId) {
        const counterActionsForShortcut =
          utils.initializeOrGetArrayProperty(counterActionsByShortcutId, newShortcutId).slice();
        counterActionsForShortcut.push(new CounterAction(newCounterData.name, shortcutActions[shortcutName]));
        counterActionsByShortcutId[newShortcutId] = counterActionsForShortcut;
      }
    }

    return counterActionsByShortcutId;
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
      const correctedShortcuts = new ShortcutCollection(counterData.shortcuts);
      for (const shortcutName of ShortcutCollection.SHORTCUT_NAMES) {
        if (Shortcut.NONE.equals(correctedShortcuts[shortcutName])) {
          correctedShortcuts[shortcutName] = Shortcut.NONE;
        }
      }
      const onChange = (newCounterData) => {
        this.updateCounters([newCounterData]);
      };
      counterData = new CounterData({
        ...counterData,
        shortcuts: correctedShortcuts,
        onChange
      });

      const counters = {
        ...state.counters,
        [name]: counterData,
      };

      const counterOrder = state.counterOrder.slice();
      const counterIndexesByName = {
        ...state.counterIndexesByName,
        [name]: counterOrder.length,
      };
      counterOrder.push(name);

      const counterActionsByShortcutId = this.getUpdatedCounterActions(
        state.counterActionsByShortcutId, { newCounterData: counterData }
      );

      return {
        counterOrder,
        counterIndexesByName,
        counters,
        counterActionsByShortcutId,
      };
    });
  }

  updateCounters = (updatedCounters) => {
    this.setState((state) => {
      const counters = { ...state.counters };

      let counterActionsByShortcutId = { ...state.counterActionsByShortcutId };
      for (let newCounterData of updatedCounters) {
        const { name } = newCounterData;
        const targetComponentIndex = state.counterIndexesByName[name];
        if (typeof targetComponentIndex !== 'number') {
          return;
        }

        if (newCounterData.shortcuts) {
          counterActionsByShortcutId = this.getUpdatedCounterActions(
            counterActionsByShortcutId, { newCounterData, oldCounterData: counters[name] }
          );

          const correctedShortcuts = {};
          for (const shortcutName of ShortcutCollection.SHORTCUT_NAMES) {
            const providedShortcut = newCounterData.shortcuts[shortcutName];
            const hasChange = String(providedShortcut) || providedShortcut === Shortcut.NONE;
            correctedShortcuts[shortcutName] = hasChange ? providedShortcut : counters[name].shortcuts[shortcutName];
          }
          newCounterData = new CounterData({
            ...counters[name],
            ...newCounterData,
            shortcuts: new ShortcutCollection(correctedShortcuts),
          });
        }

        counters[name] = {
          ...counters[name],
          ...newCounterData,
        };
      }

      return { counters, counterActionsByShortcutId };
    }, this.updateCheckedCountersState);
  }

  updateCheckedCountersState = () => {
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
    }, this.updateCheckedCountersState);
  }

  removedCheckedCounters = () => {
    if (this.state.checkedCounters.length === 0) {
      return;
    }

    this.setState((state) => {
      const counterIndexesByName = { ...state.counterIndexesByName };
      const counters = { ...state.counters };
      let counterActionsByShortcutId = { ...state.counterActionsByShortcutId };

      let removed = 0;
      const counterOrder = state.counterOrder.filter((name, index) => {
        const checked = counters[name].checked;
        if (checked) {
          const newCounterData = new CounterData({ ...counters[name], shortcuts: ShortcutCollection.EMPTY });
          counterActionsByShortcutId = this.getUpdatedCounterActions(
            counterActionsByShortcutId, { newCounterData, oldCounterData: counters[name] }
          );

          delete counterIndexesByName[name];
          delete counters[name];
          removed += 1;
        } else {
          counterIndexesByName[name] = index - removed;
        }
        return !checked;
      });

      return {
        counterOrder,
        counterIndexesByName,
        counters,
        counterActionsByShortcutId,
        isEditModeEnabled: false,
      }
    }, this.updateCheckedCountersState);
  }

  openOrCloseModal = (willOpen, modal) => {
    this.setState({ modal: willOpen ? modal : '' });
  }

  isEveryCounterChecked = () => {
    return this.state.checkedCounters.length === this.state.counterOrder.length;
  }

  handleResetClick = () => {
    if (this.state.checkedCounters.length === 0) {
      return;
    }

    const countersToUpdate = this.state.checkedCounters.map((name) => ({
      name,
      checked: false,
      value: this.state.counters[name].initial,
    }));
    this.updateCounters(countersToUpdate);
    this.setState({ isEditModeEnabled: false });
  }

  handleRemoveClick = () => {
    this.removedCheckedCounters();
  }

  handleNewCounterClick = () => {
    this.openOrCloseModal(true, 'AddNewCounterModal');
  }

  handleNewCounterModalSubmit = (param) => {
    // TODO - Validate param
    // TODO - if `value` is not a number, assign `initial` to `value`
    const newCounter = new CounterData({
      ...param,
      value: param.initial,
    });
    this.appendCounter(newCounter);

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
    const { counters } = this.state;

    const overwritingShortcuts = {};
    for (const shortcutName of ShortcutCollection.SHORTCUT_NAMES) {
      if (param.shortcuts[shortcutName] !== Shortcut.JUMBLED) {
        overwritingShortcuts[shortcutName] = param.shortcuts[shortcutName];
      }
    }

    const newCounters = param.names.map((name) => {
      const {
        initial = counters[name].initial,
        min = counters[name].min,
        max = counters[name].max,
        step = counters[name].step,
        shortcuts = counters[name].shortcuts,
      } = param;
      return {
        name, initial, min, max, step,
        shortcuts: new ShortcutCollection({ ...shortcuts, ...overwritingShortcuts }),
      };
    });
    this.updateCounters(newCounters);

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
          <GlobalEditModeContext.Provider
            value={this.state.isEditModeEnabled}
          >
            {counterComponents}
          </GlobalEditModeContext.Provider>
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
