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
import {
  OPEN_SIDE_BAR, CLOSE_SIDE_BAR, SET_CURRENT_PAGE,
} from '../modules/actionTypes';
import ScrollButton from './ScrollButton';

/* global window */
const getWidth = () => {
  const isSSR = typeof window === 'undefined';
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class MobileContainer extends Component {
  onMenuClick = (page) => {
    const { setCurrentPage } = this.props;
    setCurrentPage(page);
  }

  onItemClick = (btn) => {
    this[btn].click();
  }

  onSidebarHide = () => {
    const { closeSideBar } = this.props;
    closeSideBar();
  }

  onBackBtnClick = () => {
    const { currentPage } = this.props;
    this[`${currentPage}Btn`].click();
  }

  render() {
    const {
      children, siteTitle, isOpened, openSideBar, isInDocument, currentPage,
    } = this.props;

    return (
      <>
        <ScrollButton scrollStepInPx="100" delayInMs="16.66" size="large" />
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
              active={currentPage === 'home'}
              onClick={() => this.onItemClick('homeBtn')}
            >
              <Link
                ref={(btn) => { this.homeBtn = btn; }}
                style={{ color: '#333' }}
                to="/"
                onClick={() => this.onMenuClick('home')}
              >
                Home
              </Link>
            </Menu.Item>
            <Menu.Item
              as="span"
              active={currentPage === 'dev'}
              onClick={() => this.onItemClick('devBtn')}
            >
              <Link
                ref={(btn) => { this.devBtn = btn; }}
                style={{ color: '#333' }}
                to="/dev"
                onClick={() => this.onMenuClick('dev')}
              >
                Dev
              </Link>
            </Menu.Item>
            <Menu.Item
              as="span"
              active={currentPage === 'til'}
              onClick={() => this.onItemClick('tilBtn')}
            >
              <Link
                ref={(btn) => { this.tilBtn = btn; }}
                style={{ color: '#333' }}
                to="/til"
                onClick={() => this.onMenuClick('til')}
              >
                TIL
              </Link>
            </Menu.Item>
            <Menu.Item
              as="span"
              active={currentPage === 'about'}
              onClick={() => this.onItemClick('aboutBtn')}
            >
              <Link
                ref={(btn) => { this.aboutBtn = btn; }}
                style={{ color: '#333' }}
                to="/about"
                onClick={() => this.onMenuClick('about')}
              >
                About
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
                  <Menu.Item className="next-icon" onClick={isInDocument ? this.onBackBtnClick : openSideBar}>
                    {isInDocument ? <Icon name="angle left" size="large" /> : <Icon name="sidebar" />}
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
      </>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node.isRequired,
  siteTitle: PropTypes.string.isRequired,
  isOpened: PropTypes.bool.isRequired,
  openSideBar: PropTypes.func.isRequired,
  closeSideBar: PropTypes.func.isRequired,
  isInDocument: PropTypes.bool.isRequired,
  currentPage: PropTypes.string.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    isOpened: state.sideBar.isOpened,
    isInDocument: state.pageState.isInDocument,
    currentPage: state.pageState.currentPage,
  }),
  dispatch => ({
    openSideBar: () => dispatch({ type: OPEN_SIDE_BAR }),
    closeSideBar: () => dispatch({ type: CLOSE_SIDE_BAR }),
    setCurrentPage: currentPage => dispatch({ type: SET_CURRENT_PAGE, payload: { currentPage } }),
  }),
)(MobileContainer);
