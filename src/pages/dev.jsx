import React from 'react';
import { Link, graphql } from 'gatsby';
import { Container } from 'semantic-ui-react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import Layout from '../components/layout';
import SEO from '../components/seo';
import './dev.css';

const Content = styled.div`
  text-align: start;
`;

const BlogPostBox = styled.div`
  margin-bottom: 30px;
`;

const MarkerHeader = styled.h3`
  margin-bottom: 0px;
`;

const ArticleDate = styled.h5`
  display: inline;
  color: #aaa;
`;

// TODO: 해시태그가 많아질 시 다음 라인으로 넘기지 않고 ... 처리 해야 함
const HashTagBox = styled.div`
  margin-top: 7px;
`;

const HashTag = styled.span`
  color: #aaa;
  margin-right: 8px;
`;

const Dev = ({ data }) => {
  const target = data.allMarkdownRemark.edges.filter(ele => ele.node.frontmatter.category === 'dev');
  return (
    <Layout>
      <SEO title="Dev" />
      <Container text>
        <Content>
          {target.map(({ node }) => (
            <Link
              key={node.id}
              to={node.frontmatter.path}
              css={css`
              `}
            >
              <BlogPostBox>
                <div className="blog-post">
                  <MarkerHeader>
                    {node.frontmatter.title}
                    {' '}
                  </MarkerHeader>
                  <ArticleDate>{node.frontmatter.date}</ArticleDate>
                  <HashTagBox>
                    {node.frontmatter.tags.map(tag => <HashTag key={tag}>{tag}</HashTag>)}
                  </HashTagBox>
                </div>
              </BlogPostBox>
            </Link>
          ))}
        </Content>
      </Container>
    </Layout>
  );
};

Dev.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }).isRequired,
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
            tags
          }
        }
      }
    }
  }
`;
