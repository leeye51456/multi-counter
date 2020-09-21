import React from 'react';
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
    const { shortcut } = this.props;
    if (shortcut === Shortcut.NONE) {
      return '(None)';
    } else if (shortcut === Shortcut.JUMBLED) {
      return '(Multiple values)';
    } else if (shortcut === Shortcut.NO_CHANGE) {
      return '(No change)';
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
          <img src={icons.reset} alt="Cancel modifying this shortcut binding" />
        </button>
        <button
          type="button"
          onClick={this.handleRemoveClick}
        >
          <img src={icons.remove} alt="Remove this shortcut binding" />
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

export default ShortcutCaptureForm;
