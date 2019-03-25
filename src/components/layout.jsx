import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Provider } from 'react-redux';
import store from '../utils/store';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';
import { FINISH_LOADING } from '../modules/actionTypes';

const ResponsiveContainer = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(store.getState().isPageLoaded.isPageLoaded);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
      store.dispatch({ type: FINISH_LOADING });
    }
  }, []);

  if (!isLoaded) return <div>the page is loading...</div>;
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
            <div>
              <DesktopContainer siteTitle={data.site.siteMetadata.title}>{children}</DesktopContainer>
              <MobileContainer siteTitle={data.site.siteMetadata.title}>{children}</MobileContainer>
            </div>
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
