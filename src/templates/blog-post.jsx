import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Container, Divider } from 'semantic-ui-react';
import Layout from '../components/layout';

const Content = styled.div`
  margin-top: 1.5em;
  text-align: start;
  display: flex;
  flex-flow: column;
  min-height: 68vh;
`;

const MarkedHeader = styled.h1`
  display: inline;
  border-radius: 1em 0 1em 0;
`;

const HeaderDate = styled.h3`
  margin-top: 10px;
  margin-bottom: 1.5em;
  color: #bbb;
  font-size: 20px;
`;

const MarkDown = styled.div`
  font-size: larger;
`;

const Template = ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Layout>
      <Container>
        <Content>
          <MarkedHeader>{post.frontmatter.title}</MarkedHeader>
          <HeaderDate>
            {post.frontmatter.date}
          </HeaderDate>
          <Divider />
          <MarkDown dangerouslySetInnerHTML={{ __html: post.html }} />
        </Content>
      </Container>
    </Layout>
  );
};

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "DD MMMM, YYYY")
        path
        title
        category
      }
    }
  }
`;

Template.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
};

export default Template;