import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>존재하지 않는 페이지에요..!</p>
  </Layout>
);

export default NotFoundPage;
