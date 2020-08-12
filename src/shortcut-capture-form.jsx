import React from 'react';
import PropTypes from 'prop-types';
import utils from './utils';

class ShortcutCaptureForm extends React.Component {
  handleKeyDown = (event) => {
    const { key, shiftKey } = event;
    const { code } = event.nativeEvent;

    if (code) {
      if (utils.isValidCode(code)) {
        this.props.onChange({ code, shiftKey });
      } else {
        this.props.onChange({ code: '', shiftKey: false });
      }

    } else {
      if (utils.isValidKey(key)) {
        this.props.onChange({ keyName: key, shiftKey });
      } else {
        this.props.onChange({ keyName: '', shiftKey: false });
      }
    }
  }

  getShortcutString = () => {
    const { keyName, code, shiftKey } = this.props;
    let shift;
    if (utils.isMacOs) {
      shift = shiftKey ? '⇧' : '';
    } else {
      shift = shiftKey ? 'Shift+' : '';
    }

    if (code) {
      return `${shift}${utils.getNotShiftedFromCode(code)}`;
    }
    return `${shift}${utils.getNotShiftedFromKey(keyName)}`;
  }

  render = () => {
    return (
      <input
        type="text"
        value={this.getShortcutString()}
        onChange={utils.no_op}
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
  onChange: utils.no_op,
};

export default ShortcutCaptureForm;
