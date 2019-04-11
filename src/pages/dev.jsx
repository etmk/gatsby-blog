import React from 'react';
import { Link, graphql } from 'gatsby';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Layout from '../components/layout';
import SEO from '../components/seo';
import '../styles/pages/dev.css';

import {
  BlogPostBox, MarkerHeader, HashTagBox, HashTag,
  Content, ArticleDate,
} from '../styles/styledTags';

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
            >
              <BlogPostBox>
                <div className="blog-post">
                  <MarkerHeader>
                    {node.frontmatter.title}
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
