import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Container,
  Menu,
  Responsive,
  Segment,
  Visibility,
  Divider,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'gatsby';
import { SET_PAGE } from '../modules/actionTypes';

const styles = {
  menuLink: { padding: '1em 1.5em', color: '#333' },
};

/* global window */
const getWidth = () => {
  const isSSR = typeof window === 'undefined';
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class DesktopContainer extends Component {
  state = { fixed: false }

  hideFixedMenu = () => this.setState({ fixed: false })

  showFixedMenu = () => this.setState({ fixed: true })

  onMenuClick = (page) => {
    const { setPage } = this.props;
    setPage({ [page]: true });
  }

  render() {
    const { children, pages } = this.props;
    const {
      home, dev, about, til,
    } = pages;
    const { fixed } = this.state;

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            textAlign="center"
            style={{ minHeight: 100, padding: '1em 0em' }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item style={{ padding: 0 }} as="span" active={home}>
                  <Link style={styles.menuLink} to="/" onClick={() => this.onMenuClick('home')}>Home</Link>
                </Menu.Item>
                <Menu.Item style={{ padding: 0 }} as="span" active={dev}>
                  <Link style={styles.menuLink} to="/dev" onClick={() => this.onMenuClick('dev')}>Dev</Link>
                </Menu.Item>
                <Menu.Item style={{ padding: 0 }} as="span" active={til}>
                  <Link style={styles.menuLink} to="/til" onClick={() => this.onMenuClick('til')}>TIL</Link>
                </Menu.Item>
                <Menu.Item style={{ padding: 0 }} as="span" active={about}>
                  <Link style={styles.menuLink} to="/about" onClick={() => this.onMenuClick('about')}>About</Link>
                </Menu.Item>
              </Container>
            </Menu>
            <br />
            {children}
            <Divider className="footer-divider" />
            <footer style={{ marginTop: '3em', marginBottom: '5em' }}>
              {`© ${new Date().getFullYear()} Sunjae Kim, All rights deserved`}
            </footer>
          </Segment>
        </Visibility>
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node.isRequired,
  setPage: PropTypes.func.isRequired,
  pages: PropTypes.shape({
    home: PropTypes.bool,
    dev: PropTypes.bool,
    about: PropTypes.bool,
    til: PropTypes.bool,
  }).isRequired,
};

export default connect(
  state => ({
    pages: state.pages,
  }),
  dispatch => ({
    setPage: page => dispatch({ type: SET_PAGE, payload: page }),
  }),
)(DesktopContainer);
