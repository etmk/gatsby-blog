import React from 'react';
import { Container } from 'semantic-ui-react';
import styled from '@emotion/styled';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Content = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  min-height: 62vh;
`;

const About = () => (
  <Layout>
    <SEO title="About" />
    <Container text>
      <Content>
        <h2>Javascript Full-stack Developer</h2>
        <h5>
          Github :
          {' '}
          <a href="https://github.com/sunjae-kim">github.com/sunjae-kim</a>
        </h5>
        <h5>
          Email :
          {' '}
          <a href="mailto:kimsj9484@gmail.com">kimsj9484@gmail.com</a>
        </h5>
      </Content>
    </Container>
  </Layout>
);

export default About;
