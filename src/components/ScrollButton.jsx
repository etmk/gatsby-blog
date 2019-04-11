import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

/* global window */
class ScrollButton extends Component {
  state = {
    intervalId: 0,
  };

  scrollStep = () => {
    const { intervalId } = this.state;
    const { scrollStepInPx } = this.props;
    if (window.pageYOffset === 0) {
      clearInterval(intervalId);
    }
    window.scroll(0, window.pageYOffset - scrollStepInPx);
  }

  scrollToTop = () => {
    const { delayInMs } = this.props;
    const intervalId = setInterval(this.scrollStep, delayInMs);
    this.setState({ intervalId });
  }

  render() {
    const { size } = this.props;
    return (
      <button
        type="button"
        title="Back to top"
        onClick={this.scrollToTop}
        className="scroll"
      >
        <Icon name="angle up" size={size} />
      </button>
    );
  }
}

ScrollButton.propTypes = {
  scrollStepInPx: PropTypes.string.isRequired,
  delayInMs: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
};

export default ScrollButton;
