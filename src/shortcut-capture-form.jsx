import React from 'react';
import { isMacOs, getKeyForDisplaying } from './utils';

const no_op = () => {};

class ShortcutCaptureForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      key: '',
      shiftKey: false,
    };
  }

  handleKeyDown = (event) => {
    const { key, shiftKey } = event;
    if (!/^[0-9A-Za-z`~!@#$%^&*(),./<>?;':"[\]\\{}|+_=-]$/.test(key)) {
      return;
    }
    this.setState({ key, shiftKey });
  }

  getKeyString = () => {
    const { key, shiftKey } = this.state;
    let shift;
    if (isMacOs) {
      shift = shiftKey ? '⇧' : '';
    } else {
      shift = shiftKey ? 'Shift+' : '';
    }

    return `${shift}${getKeyForDisplaying(key)}`;
  }

  render = () => {
    return (
      <ul>
        <li>
          <input
            type="text"
            value={this.getKeyString()}
            onChange={no_op}
            onKeyDown={this.handleKeyDown}
          />
        </li>
      </ul>
    );
  }
}

export default ShortcutCaptureForm;
