import React from 'react';
import utils from './utils';

class ShortcutCaptureForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      key: '',
      code: '',
      shiftKey: false,
    };
  }

  handleKeyDown = (event) => {
    const { key, shiftKey } = event;
    const { code } = event.nativeEvent;

    if (!code) {
      if (utils.isValidKey(key)) {
        this.setState({ key, shiftKey });
      }
      return;
    }

    if (utils.isValidCode(code)) {
      this.setState({ code, shiftKey });
    }
  }

  getShortcutString = () => {
    const { key, code, shiftKey } = this.state;
    let shift;
    if (utils.isMacOs) {
      shift = shiftKey ? '⇧' : '';
    } else {
      shift = shiftKey ? 'Shift+' : '';
    }

    if (code) {
      return `${shift}${utils.getNotShiftedFromCode(code)}`;
    }
    return `${shift}${utils.getNotShiftedFromKey(key)}`;
  }

  render = () => {
    return (
      <ul>
        <li>
          <input
            type="text"
            value={this.getShortcutString()}
            onChange={utils.no_op}
            onKeyDown={this.handleKeyDown}
            style={{ textAlign: 'right' }}
          />
        </li>
      </ul>
    );
  }
}

export default ShortcutCaptureForm;
