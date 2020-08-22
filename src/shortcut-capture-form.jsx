import React from 'react';
import PropTypes from 'prop-types';
import CounterAction from './counter-action';
import Shortcut from './shortcut';
import { isMacOs } from './utils';

class ShortcutCaptureForm extends React.Component {
  handleKeyDown = (event) => {
    const { key, shiftKey } = event;
    const { code } = event.nativeEvent;

    if (code) {
      if (Shortcut.isValidCode(code)) {
        this.props.onChange({ code, shiftKey });
      } else {
        this.props.onChange({ code: '', shiftKey: false });
      }

    } else {
      if (Shortcut.isValidKey(key)) {
        this.props.onChange({ keyName: key, shiftKey });
      } else {
        this.props.onChange({ keyName: '', shiftKey: false });
      }
    }
  }

  getShortcutString = () => {
    const { keyName, code, shiftKey } = this.props;
    let shift;
    if (isMacOs) {
      shift = shiftKey ? '⇧' : '';
    } else {
      shift = shiftKey ? 'Shift+' : '';
    }

    if (code) {
      return `${shift}${Shortcut.getNotShiftedFromCode(code)}`;
    }
    return `${shift}${Shortcut.getNotShiftedFromKey(keyName)}`;
  }

  render = () => {
    return (
      <input
        type="text"
        value={this.getShortcutString()}
        onChange={CounterAction.actionPresets.noOp}
        onKeyDown={this.handleKeyDown}
        // style={{ textAlign: 'right' }}
      />
    );
  }
}

ShortcutCaptureForm.propTypes = {
  keyName: PropTypes.string,
  code: PropTypes.string,
  shiftKey: PropTypes.bool,
  onChange: PropTypes.func,
}

ShortcutCaptureForm.defaultProps = {
  keyName: '',
  code: '',
  shiftKey: false,
  onChange: CounterAction.actionPresets.noOp,
};

export default ShortcutCaptureForm;
