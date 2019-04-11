import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Provider } from 'react-redux';
import { Loader, Dimmer } from 'semantic-ui-react';
import store from '../utils/store';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';
import { FINISH_LOADING, SET_CURRENT_PAGE } from '../modules/actionTypes';

import '../styles/layout.css';

/* global window */
const ResponsiveContainer = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(store.getState().pageState.isPageLoaded);

  useEffect(() => {
    if (!isLoaded) {
      const { pathname } = window.location;
      const splited = pathname.split('/')[1];
      const currentPage = splited !== '' ? splited : 'home';
      setIsLoaded(true);
      store.dispatch({ type: FINISH_LOADING });
      store.dispatch({ type: SET_CURRENT_PAGE, payload: { currentPage } });
    }
  }, []);

  const renderLoading = () => (
    <div>
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    </div>
  );

  if (!isLoaded) return renderLoading();

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
