import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const ListLink = ({ to, children }) => (
  <div style={{ marginRight: '1rem' }}>
    <Link to={to}>{children}</Link>
  </div>
);

const Header = ({ siteTitle }) => (
  <header
    style={{
      marginBottom: '1.45rem',
      borderBottom: '1px solid #DCDCDC',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: '#101010',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <ListLink to="/">Home</ListLink>
        <ListLink to="/about/">About</ListLink>
        <ListLink to="/dev/">Devlog</ListLink>
        <ListLink to="/til/">TIL</ListLink>
      </div>
    </div>
  </header>
);

ListLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
