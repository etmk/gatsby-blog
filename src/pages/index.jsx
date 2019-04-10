import React from 'react';
import { Container } from 'semantic-ui-react';
import styled from '@emotion/styled';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Content = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  min-height: 68vh;
`;

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={['gatsby', 'netlify', 'react', 'blog']} />
    <Container text>
      <Content>
        <h2>Welcome to Sunjae's Blog</h2>
        <p>This page is created by Gatsby and deployed by Netlify</p>
      </Content>
    </Container>
  </Layout>
);

export default IndexPage;
