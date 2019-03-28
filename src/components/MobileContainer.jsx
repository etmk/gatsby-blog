import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Container,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'gatsby';
import { SET_PAGE, OPEN_SIDE_BAR, CLOSE_SIDE_BAR } from '../modules/actionTypes';

/* global window */
const getWidth = () => {
  const isSSR = typeof window === 'undefined';
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

const styles = {
  menuLink: { color: '#333' },
};

class MobileContainer extends Component {
  onMenuClick = (page) => {
    const { setPage } = this.props;
    setPage({ [page]: true });
  }

  onItemClick = (btn) => {
    this[btn].click();
  }

  onSidebarHide = () => {
    const { closeSideBar } = this.props;
    closeSideBar();
  }

  render() {
    const {
      children, siteTitle, pages, isOpened, openSideBar,
    } = this.props;
    const {
      home, dev, about, til,
    } = pages;

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation="push"
          onHide={this.onSidebarHide}
          vertical
          visible={isOpened}
          width="thin"
        >
          <Menu.Item
            as="span"
            active={home}
            onClick={() => this.onItemClick('homeBtn')}
          >
            <Link
              ref={(btn) => { this.homeBtn = btn; }}
              style={styles.menuLink}
              to="/"
              onClick={() => this.onMenuClick('home')}
            >
              Home
            </Link>
          </Menu.Item>
          <Menu.Item
            as="span"
            active={dev}
            onClick={() => this.onItemClick('devBtn')}
          >
            <Link
              ref={(btn) => { this.devBtn = btn; }}
              style={styles.menuLink}
              to="/dev"
              onClick={() => this.onMenuClick('dev')}
            >
              Dev
            </Link>
          </Menu.Item>
          <Menu.Item
            as="span"
            active={about}
            onClick={() => this.onItemClick('aboutBtn')}
          >
            <Link
              ref={(btn) => { this.aboutBtn = btn; }}
              style={styles.menuLink}
              to="/about"
              onClick={() => this.onMenuClick('about')}
            >
              About
            </Link>
          </Menu.Item>
          <Menu.Item
            as="span"
            active={til}
            onClick={() => this.onItemClick('tilBtn')}
          >
            <Link
              ref={(btn) => { this.tilBtn = btn; }}
              style={styles.menuLink}
              to="/til"
              onClick={() => this.onMenuClick('til')}
            >
              TIL
            </Link>
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={isOpened}>
          <Segment
            textAlign="center"
            style={{ minHeight: '100vh', padding: '1em 0em' }}
            vertical
          >
            <Container>
              <Menu pointing secondary size="large">
                <Menu.Item onClick={openSideBar}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item position="right">
                  <h4 style={{ margin: 0 }}>{siteTitle}</h4>
                </Menu.Item>
              </Menu>
              {children}
              <footer style={{ marginTop: '3em', marginBottom: '5em' }}>
                {`© ${new Date().getFullYear()} Sunjae Kim, All rights deserved`}
              </footer>
            </Container>
          </Segment>
        </Sidebar.Pusher>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node.isRequired,
  siteTitle: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  pages: PropTypes.shape({
    home: PropTypes.bool,
    dev: PropTypes.bool,
    about: PropTypes.bool,
    til: PropTypes.bool,
  }).isRequired,
  isOpened: PropTypes.bool.isRequired,
  openSideBar: PropTypes.func.isRequired,
  closeSideBar: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    pages: state.pages,
    isOpened: state.sideBar.isOpened,
  }),
  dispatch => ({
    setPage: page => dispatch({ type: SET_PAGE, payload: page }),
    openSideBar: () => dispatch({ type: OPEN_SIDE_BAR }),
    closeSideBar: () => dispatch({ type: CLOSE_SIDE_BAR }),
  }),
)(MobileContainer);
