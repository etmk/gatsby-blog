import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import 'semantic-ui-css/semantic.min.css';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'application', 'react']} />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
  </Layout>
);

export default IndexPage;