import PropTypes from 'prop-types';
import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Provider } from 'react-redux';
import store from '../utils/store';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const ResponsiveContainer = ({ children }) => (
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

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ResponsiveContainer;
