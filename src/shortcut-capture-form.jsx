import React from 'react';
import PropTypes from 'prop-types';
import CounterAction from './counter-action';
import Shortcut from './shortcut';

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

  handleCancelClick = () => {
    this.props.onChange(Shortcut.NO_CHANGE);
  }

  handleRemoveClick = () => {
    this.props.onChange(Shortcut.NONE);
  }

  render = () => {
    return (
      <>
        <input
          type="text"
          value={this.getShortcutString()}
          onChange={CounterAction.PRESETS.NO_OP}
          onKeyDown={this.handleKeyDown}
        />
        <button
          type="button"
          onClick={this.handleCancelClick}
        >
          Cancel Change
        </button>
        <button
          type="button"
          onClick={this.handleRemoveClick}
        >
          Remove
        </button>
      </>
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
  onChange: CounterAction.PRESETS.NO_OP,
};

export default ShortcutCaptureForm;
