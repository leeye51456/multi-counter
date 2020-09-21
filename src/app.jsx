import React from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import Counter from './counter';
import AddNewCounterModal from './add-new-counter-modal';
import EditCountersModal from './edit-counters-modal';
import { GlobalEditModeContext } from './contexts';
import CounterAction from './counter-action';
import CounterData from './counter-data';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';
import localStorageManager from './local-storage-manager';
import icons from './icons';
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
      singleCounterToEdit: null,
      modal: '',
      isEditModeEnabled: false,
    };
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.handleDocumentKeyDown);

    this.loadCounters();
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

  loadCounters = () => {
    for (const name of localStorageManager.getCounterOrder()) {
      const counter = localStorageManager.getCounterData(name);
      if (counter) {
        this.appendCounter(counter);
      }
    }
  }

  getUpdatedCounterActions = (counterActionsByShortcutId, { newCounterData, oldCounterData }) => {
    const shortcutActions = {
      countUp: CounterAction.actionPresets.GET_COUNTED_UP,
      countDown: CounterAction.actionPresets.GET_COUNTED_DOWN,
    };
    const oldShortcuts = oldCounterData && oldCounterData.shortcuts;
    const newShortcuts = newCounterData.shortcuts;

    counterActionsByShortcutId = { ...counterActionsByShortcutId };
    for (const shortcutName of ShortcutCollection.shortcutNames) {
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
      for (const shortcutName of ShortcutCollection.shortcutNames) {
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
        onChange,
        onEditClick: this.handleSingleCounterEditClick,
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

      localStorageManager.setCounterOrder(counterOrder);
      localStorageManager.setCounterData(counterData);

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
          for (const shortcutName of ShortcutCollection.shortcutNames) {
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

        localStorageManager.setCounterData(counters[name]);
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

  removeCheckedCounters = () => {
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
          localStorageManager.removeCounterData(name);
          removed += 1;
        } else {
          counterIndexesByName[name] = index - removed;
        }
        return !checked;
      });

      localStorageManager.setCounterOrder(counterOrder);

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

  handleResetClick = (event) => {
    event.preventDefault();
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

  handleRemoveClick = (event) => {
    event.preventDefault();
    this.removeCheckedCounters();
  }

  handleClearClick = (event) => {
    event.preventDefault();
    if (window.confirm('All counters will be removed if you click ‘OK’ button.')) {
      localStorageManager.initialize();
      window.location.reload();
    }
  }

  handleNewCounterClick = (event) => {
    event.preventDefault();
    this.openOrCloseModal(true, 'AddNewCounterModal');
  }

  handleNewCounterModalSubmit = (param) => {
    const newCounter = new CounterData({
      ...param,
      value: param.initial,
    });
    this.appendCounter(newCounter);

    this.openOrCloseModal(false);
  }

  handleEditCountersClick = (event) => {
    event.preventDefault();
    if (this.state.checkedCounters.length > 0) {
      this.openOrCloseModal(true, 'EditCountersModal');
    }
  }

  handleEditCountersModalSubmit = (param) => {
    const { counters } = this.state;

    const overwritingShortcuts = {};
    for (const shortcutName of ShortcutCollection.shortcutNames) {
      if (param.shortcuts[shortcutName] !== Shortcut.JUMBLED) {
        overwritingShortcuts[shortcutName] = param.shortcuts[shortcutName];
      }
    }

    const newCounters = param.names.map((name) => {
      const {
        value = counters[name].value,
        initial = counters[name].initial,
        min = counters[name].min,
        max = counters[name].max,
        step = counters[name].step,
        shortcuts = counters[name].shortcuts,
      } = param;
      return {
        name, value, initial, min, max, step,
        shortcuts: new ShortcutCollection({ ...shortcuts, ...overwritingShortcuts }),
      };
    });
    this.updateCounters(newCounters);

    this.openOrCloseModal(false);
    if (!this.state.singleCounterToEdit) {
      this.checkOrUncheckAll(false);
    }
    this.setState((state) => ({
      singleCounterToEdit: null,
      isEditModeEnabled: !!state.singleCounterToEdit,
    }));
  }

  handleModalCancel = () => {
    this.openOrCloseModal(false);
    this.setState({ singleCounterToEdit: null });
  }

  handleEditCounterListClick = (event) => {
    event.preventDefault();
    this.checkOrUncheckAll(false);
    this.setState((state) => {
      return {
        isEditModeEnabled: !state.isEditModeEnabled,
      };
    });
  }

  handleSelectAllClick = (event) => {
    event.preventDefault();
    this.checkOrUncheckAll(!this.isEveryCounterChecked());
  }

  handleSingleCounterEditClick = (name) => {
    this.setState((state) => ({
      singleCounterToEdit: state.counters[name],
    }), () => {
      this.openOrCloseModal(true, 'EditCountersModal');
    });
  }

  render = () => {
    const isEditModeEnabled = this.state.isEditModeEnabled;
    const classes = {
      headerItem: {
        normalOnly: classNames('header-item', { 'force-hidden': isEditModeEnabled }),
        editModeOnly: classNames('header-item', { 'force-hidden': !isEditModeEnabled }),
      },
      addNewCounterButton: classNames('button-add', 'button-positive', { 'invisible': isEditModeEnabled }),
    };

    const counterComponents = this.state.counterOrder.slice().map((name) => {
      return this.getNewCounter(this.state.counters[name]);
    });
    const singleCounterToEdit = this.state.singleCounterToEdit;
    const editCountersModalProps = {
      counters: (
        singleCounterToEdit
        ? { [singleCounterToEdit.name]: singleCounterToEdit }
        : this.state.counters
      ),
      names: singleCounterToEdit ? [singleCounterToEdit.name] : this.state.checkedCounters,
    };

    return (
      <div className="App">

        <div className="header-container">
          <header className="header">
            <ul className="header-item-group group-left">
              <li className={classes.headerItem.normalOnly}>
                <h1 className="app-title">
                  MultiCounter
                </h1>
              </li>

              <li className={classes.headerItem.editModeOnly}>
                <button
                  type="button"
                  onClick={this.handleSelectAllClick}
                  className="button-with-icon-text"
                >
                  <img src={icons.checkAll} alt="" />
                  <span>Select All</span>
                </button>
              </li>

              <li className={classes.headerItem.editModeOnly}>
                <button
                  type="button"
                  onClick={this.handleEditCountersClick}
                  className="button-with-icon-text"
                >
                  <img src={icons.edit} alt="" />
                  <span>Edit</span>
                </button>
              </li>

              <li className={classes.headerItem.editModeOnly}>
                <button
                  type="button"
                  onClick={this.handleResetClick}
                  className="button-with-icon-text button-negative"
                >
                  <img src={icons.reset} alt="" />
                  <span>Reset</span>
                </button>
              </li>

              <li className={classes.headerItem.editModeOnly}>
                <button
                  type="button"
                  onClick={this.handleRemoveClick}
                  className="button-with-icon-text button-negative"
                >
                  <img src={icons.remove} alt="" />
                  <span>Remove</span>
                </button>
              </li>

              <li className={classes.headerItem.editModeOnly}>
                <button
                  type="button"
                  onClick={this.handleClearClick}
                  className="button-with-icon-text button-negative"
                >
                  <img src={icons.clear} alt="" />
                  <span>Clear All</span>
                </button>
              </li>
            </ul>

            <ul className="header-item-group group-right">
              <li className="header-item">
                <button
                  type="button"
                  onClick={this.handleEditCounterListClick}
                  className="button-with-icon"
                >
                  {
                    isEditModeEnabled
                    ? <img src={icons.close} alt="Exit Edit Mode" />
                    : <img src={icons.menu} alt="Edit Counter List" />
                  }
                </button>
              </li>
            </ul>
          </header>
        </div>

        <div className="main-container">
          <main className="main">
            <GlobalEditModeContext.Provider
              value={isEditModeEnabled}
            >
              {counterComponents}
            </GlobalEditModeContext.Provider>

            <div className="main-additional">
              <button
                type="button"
                onClick={this.handleNewCounterClick}
                className={classes.addNewCounterButton}
              >
                <img src={icons.add} alt="Add New Counter" />
              </button>
            </div>
          </main>
        </div>

        <AddNewCounterModal
          existingNames={this.state.counterOrder}
          isOpen={this.state.modal === 'AddNewCounterModal'}
          onSubmit={this.handleNewCounterModalSubmit}
          onCancel={this.handleModalCancel}
        />

        <EditCountersModal
          counters={editCountersModalProps.counters}
          names={editCountersModalProps.names}
          isOpen={this.state.modal === 'EditCountersModal'}
          onSubmit={this.handleEditCountersModalSubmit}
          onCancel={this.handleModalCancel}
        />
      </div>
    );
  }
}

export default App;
