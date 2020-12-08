import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Shortcut from './shortcut';
import { NO_OP } from './utils';
import icons from './icons';

class ShortcutCaptureForm extends React.Component {
  handleKeyDown = (event) => {
    const { key: keyName, shiftKey } = event;
    const { code } = event.nativeEvent;

    if (code) {
      if (Shortcut.isValidCode(code)) {
        this.props.onChange(new Shortcut({ code, shiftKey }));
      } else {
        this.props.onChange(Shortcut.NONE);
      }

    } else {
      if (Shortcut.isValidKey(keyName)) {
        this.props.onChange(new Shortcut({ keyName, shiftKey }));
      } else {
        this.props.onChange(Shortcut.NONE);
      }
    }
  }

  getShortcutString = () => {
    const { t, shortcut } = this.props;
    if (shortcut === Shortcut.NONE) {
      return `(${t('shortcut-capture-form.shortcut.none')})`;
    } else if (shortcut === Shortcut.JUMBLED) {
      return `(${t('shortcut-capture-form.shortcut.multiple')})`;
    } else if (shortcut === Shortcut.NO_CHANGE) {
      return `(${t('shortcut-capture-form.shortcut.no-change')})`;
    }
    return shortcut.getStringToDisplay();
  }

  handleCancelClick = (event) => {
    event.preventDefault();
    this.props.onChange(Shortcut.NO_CHANGE);
  }

  handleRemoveClick = (event) => {
    event.preventDefault();
    this.props.onChange(Shortcut.NONE);
  }

  render = () => {
    const { t } = this.props;

    return (
      <div className="extended-input">
        <input
          type="text"
          value={this.getShortcutString()}
          onChange={NO_OP}
          onKeyDown={this.handleKeyDown}
        />
        <button
          type="button"
          onClick={this.handleCancelClick}
        >
          <img
            src={icons.reset}
            alt={t('shortcut-capture-form.cancel')}
            width={24}
            height={24}
          />
        </button>
        <button
          type="button"
          onClick={this.handleRemoveClick}
        >
          <img
            src={icons.remove}
            alt={t('shortcut-capture-form.remove')}
            width={24}
            height={24}
          />
        </button>
      </div>
    );
  }
}

ShortcutCaptureForm.propTypes = {
  onChange: PropTypes.func,
}

ShortcutCaptureForm.defaultProps = {
  keyName: '',
  code: '',
  shiftKey: false,
  shortcut: Shortcut.NO_CHANGE,
  onChange: NO_OP,
};

export default withTranslation()(ShortcutCaptureForm);
