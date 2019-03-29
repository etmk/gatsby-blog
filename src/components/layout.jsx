import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Provider } from 'react-redux';
import store from '../utils/store';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';
import ScrollButton from './ScrollButton';
import { FINISH_LOADING, SET_PAGE } from '../modules/actionTypes';

import './layout.css';

/* global window */
const ResponsiveContainer = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(store.getState().isPageLoaded.isPageLoaded);

  useEffect(() => {
    if (!isLoaded) {
      const { pathname } = window.location;
      const splited = pathname.split('/')[1];
      const endPoint = splited !== '' ? splited : 'home';
      setIsLoaded(true);
      store.dispatch({ type: FINISH_LOADING });
      store.dispatch({ type: SET_PAGE, payload: { [endPoint]: true } });
    }
  }, []);

  if (!isLoaded) return <div>Loading, please wait ...</div>;
  return (
    <Provider store={store}>
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => (
          <>
            <DesktopContainer
              siteTitle={data.site.siteMetadata.title}
            >
              {children}
            </DesktopContainer>
            <MobileContainer
              siteTitle={data.site.siteMetadata.title}
            >
              {children}
            </MobileContainer>
            <ScrollButton scrollStepInPx="100" delayInMs="16.66" />
          </>
        )}
      />
    </Provider>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ResponsiveContainer;
