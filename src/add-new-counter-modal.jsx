import React from 'react';
import ReactModal from 'react-modal';
import { withTranslation } from 'react-i18next';
import escapeStringRegexp from 'escape-string-regexp';
import NumberInput from './number-input';
import ShortcutCaptureForm from './shortcut-capture-form';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';
import { insertCommas, numbersWithCommas } from './utils';
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

    this.bindNumberInputEventHandler(['initial', 'min', 'max'], ['change', 'invert']);
    this.bindNumberInputEventHandler(['step'], ['change']);

    this.nameRef = React.createRef();
    this.initialRef = React.createRef();
    this.minRef = React.createRef();
    this.maxRef = React.createRef();
    this.stepRef = React.createRef();

    this.state = defaultState;
  }

  bindNumberInputEventHandler = (names, types) => {
    for (const name of names) {
      const sentenceCasedName = name[0].toUpperCase() + name.substring(1);
      for (const type of types) {
        const sentenceCasedType = type[0].toUpperCase() + type.substring(1);
        const primitiveFunctionName = `handleNumberInput${sentenceCasedType}`;
        if (this[primitiveFunctionName]) {
          this[`handle${sentenceCasedName}${sentenceCasedType}`] = this[primitiveFunctionName].bind(this, name);
        }
      }
    }
  }

  handleModalAfterOpen = () => {
    if (!this.props.existingNames) {
      this.props.onCancel();
      return;
    }

    this.setState({
      ...defaultState,
      namePattern: `^(?!(${this.props.existingNames.map((value) => escapeStringRegexp(value)).join('|')})$).+$`,
    });
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  }

  handleNumberInputChange = (stateName, event) => {
    this.setState({ [stateName]: event.target.value });
  }
  handleNumberInputInvert = (stateName) => {
    this.setState((state) => {
      if (!isNaN(parseInt(state[stateName], 10))) {
        return { [stateName]: -state[stateName] };
      }
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

  handleSubmitClick = (event) => {
    event.preventDefault();

    const { t } = this.props;
    const rejectionReasons = [t('modal.rejection.notice')];
    if (!this.nameRef.current.validity.valid) {
      rejectionReasons.push(t('modal.rejection.name'));
    }
    const rangeValidity = (
      this.initialRef.current.validity.valid
      && this.minRef.current.validity.valid
      && this.maxRef.current.validity.valid
    );
    if (!rangeValidity) {
      rejectionReasons.push(t('modal.rejection.range'));
    }
    if (!this.stepRef.current.validity.valid) {
      rejectionReasons.push(t('modal.rejection.step'));
    }

    if (rejectionReasons.length > 1) {
      window.alert(rejectionReasons.join('\n- '));
      return;
    }

    let {name, initial, min, max, step} = this.state;
    [initial, min, max, step] = [initial, min, max, step].map((value) => Number.parseInt(value, 10));
    const { countUpShortcut: countUp, countDownShortcut: countDown } = this.state;
    const shortcuts = new ShortcutCollection({ countUp, countDown });

    this.props.onSubmit({ name, initial, min, max, step, shortcuts });
  }

  handleCancelClick = (event) => {
    event.preventDefault();
    this.props.onCancel();
  }

  render = () => {
    const { t } = this.props;
    const modalTitle = t('modal.title.add-new-counter');

    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.handleModalAfterOpen}
        onRequestClose={this.props.onCancel}
        contentLabel={modalTitle}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h1>
          {modalTitle}
        </h1>

        <hr />

        <ul>
          <li>
            <label>
              {t('modal.name')}
            </label>
            <input
              ref={this.nameRef}
              type="text"
              required={true}
              pattern={this.state.namePattern}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </li>
          <li>
            <label>
              {t('modal.initial')} ({t('modal.integer')})
            </label>
            <NumberInput
              ref={this.initialRef}
              required={true}
              min={this.state.min}
              max={this.state.max}
              step={1}
              value={this.state.initial}
              onChange={this.handleInitialChange}
              onInvert={this.handleInitialInvert}
            />
            <p className="modal-input-constraint">
              {insertCommas(this.state.min)} ... {insertCommas(this.state.max)}
            </p>
          </li>
          <li>
            <label>
              {t('modal.min')} ({t('modal.integer')})
            </label>
            <NumberInput
              ref={this.minRef}
              required={true}
              min={Number.MIN_SAFE_INTEGER}
              max={this.state.initial}
              step={1}
              value={this.state.min}
              onChange={this.handleMinChange}
              onInvert={this.handleMinInvert}
            />
            <p className="modal-input-constraint">
              {numbersWithCommas.MIN_SAFE_INTEGER} ... {insertCommas(this.state.initial)}
            </p>
          </li>
          <li>
            <label>
              {t('modal.max')} ({t('modal.integer')})
            </label>
            <NumberInput
              ref={this.maxRef}
              required={true}
              min={this.state.initial}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.max}
              onChange={this.handleMaxChange}
              onInvert={this.handleMaxInvert}
            />
            <p className="modal-input-constraint">
              {insertCommas(this.state.initial)} ... {numbersWithCommas.MAX_SAFE_INTEGER}
            </p>
          </li>
          <li>
            <label>
              {t('modal.step')} ({t('modal.positive-integer')})
            </label>
            <NumberInput
              ref={this.stepRef}
              required={true}
              min={1}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              value={this.state.step}
              onChange={this.handleStepChange}
            />
            <p className="modal-input-constraint">
              1 ... {numbersWithCommas.MAX_SAFE_INTEGER}
            </p>
          </li>
        </ul>

        <hr />

        <h2>
          {t('modal.shortcuts')}
        </h2>
        <ul>
          <li>
            <label>
              {t('modal.count-up')}
            </label>
            <ShortcutCaptureForm
              shortcut={this.state.countUpShortcut}
              onChange={this.handleCountUpShortcutChange}
            />
          </li>
          <li>
            <label>
              {t('modal.count-down')}
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
              className="action-button button-negative"
            >
              <img
                src={icons.close}
                alt={t('modal.cancel')}
                width={24}
                height={24}
              />
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={this.handleSubmitClick}
              className="action-button button-positive"
            >
              <img
                src={icons.check}
                alt={t('modal.apply')}
                width={24}
                height={24}
              />
            </button>
          </li>
        </ul>

      </ReactModal>
    );
  }
}

export default withTranslation([], { withRef: true })(AddNewCounterModal);
