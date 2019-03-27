import React from 'react';
import { Link, graphql } from 'gatsby';
import { Container } from 'semantic-ui-react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Content = styled.div`
  text-align: start;
`;

const ArticleDate = styled.h5`
  display: inline;
  color: #bbb;
  margin-bottom: 10px;
`;

const MarkerHeader = styled.h3`
  display: inline;
  border-radius: 1em 0 1em 0;
  margin-bottom: 10px;
`;

const Dev = ({ data }) => {
  const target = data.allMarkdownRemark.edges.filter(ele => ele.node.frontmatter.category === 'tech');
  return (
    <Layout>
      <SEO title="Dev" />
      <Container>
        <Content>
          <h1>Dev</h1>
          {target.map(({ node }) => (
            <div key={node.id} style={{ margin: '70px auto' }}>
              <Link
                to={node.frontmatter.path}
                css={css`
                text-decoration: none;
                color: inherit;
              `}
              >
                <MarkerHeader>
                  {node.frontmatter.title}
                  {' '}
                </MarkerHeader>
                <div>
                  <ArticleDate>{node.frontmatter.date}</ArticleDate>
                </div>
                <p>{node.excerpt}</p>
              </Link>
            </div>
          ))}
        </Content>
      </Container>
    </Layout>
  );
};

export default Dev;

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            path
            category
          }
        }
      }
    }
  }
`;
