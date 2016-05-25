'use strict';

import React, {
  Component,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const TAP_DELAY = 250;
const COUNT_HANDLER_MAP = [
  { count: 1, fn: 'onTap' },
  { count: 2, fn: 'onDoubleTap' },
  { count: 3, fn: 'onTripleTap' },
]

class Tapable extends Component {

  constructor() {
    super();

    // Timer Vars
    this._timer = null;
    this._tapCount = 0;

    // Bind functions to instance
    this._bind();
  }

  _bind() {
    this.onPress = this.onPress.bind(this);
    this._timerExpired = this._timerExpired.bind(this);
  }

  reset() {
    this._timer = null;
    this._tapCount = 0;
  }

  onPress() {
    this._timer
      ? this._handlePress()
      : this._handleInitialPress();
  }

  _handlePress() {
    this._tapCount++;
    this._shouldKeepListening()
      ? this._extendTimer()
      : this._forceExpire();
  }

  _handleInitialPress() {
    this._tapCount = 1;
    this._shouldKeepListening()
      ? this._startTimer()
      : this._forceExpire();
  }

  _startTimer() {
    this._timer = setTimeout(this._timerExpired, TAP_DELAY);
  }

  _extendTimer() {
    clearTimeout(this._timer);
    this._startTimer();
  }

  _forceExpire() {
    clearTimeout(this._timer);
    this._timerExpired();
  }

  _timerExpired() {
    // Find and run the proper handler for the tap count
    let current = COUNT_HANDLER_MAP.find((row) => row.count === this._tapCount);
    this.props[current.fn] && this.props[current.fn]();
    // Reset timer and tap count
    this.reset();
  }

  _shouldKeepListening() {
    // Check if there are any listeners assigned to tapCounts
    // higher than the current count
    return COUNT_HANDLER_MAP.find((row) => {
      return !!(row.count > this._tapCount && this.props[row.fn]);
    });
  }

  render() {
    return(
      <View style={this.props.style}>
        <TouchableWithoutFeedback
          style={[this.props.style]}
          onPress={this.onPress}
        >
          { this.props.children }
        </TouchableWithoutFeedback>
      </View>
    );
  }

}

Tapable.propTypes = {
  onTap: React.PropTypes.func,
  onDoubleTap: React.PropTypes.func,
  onTripleTap: React.PropTypes.func,
  style: View.propTypes.style,
};

export default Tapable;
