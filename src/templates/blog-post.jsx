import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Container, Divider, Icon } from 'semantic-ui-react';
import SEO from '../components/seo';
import store from '../utils/store';
import Layout from '../components/layout';
import { TOGGLE_IS_IN_DOCUMENT } from '../modules/actionTypes';
import {
  BlogPostBox, MarkerHeader, HashTagBox, HashTag,
  Content, MarkedHeader, HeaderDate, MarkDown,
} from '../styles/styledTags';

/* global window */
class Template extends Component {
  componentDidMount = () => {
    store.dispatch({ type: TOGGLE_IS_IN_DOCUMENT });
  }

  componentWillUnmount = () => {
    store.dispatch({ type: TOGGLE_IS_IN_DOCUMENT });
  }

  renderCard = (post, isPrev) => (
    <BlogPostBox>
      <Link
        key={post.id}
        to={post.frontmatter.path}
      >
        <div className="blog-post">
          <div style={{ display: 'flex' }}>
            <div
              className="prev-icon"
              style={{
                display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center',
              }}
            >
              {isPrev && <Icon name="angle left" size="large" />}
            </div>
            <div style={{ flex: 10, overflow: 'auto' }}>
              <MarkerHeader>
                {post.frontmatter.title}
              </MarkerHeader>
              <HashTagBox>
                {post.frontmatter.tags.map(tag => <HashTag key={tag}>{tag}</HashTag>)}
              </HashTagBox>
            </div>
            <div
              className="next-icon"
              style={{
                display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center',
              }}
            >
              {!isPrev && <Icon name="angle right" size="large" />}
            </div>
          </div>
        </div>
      </Link>
    </BlogPostBox>
  )

  renderPost = ({ prevPost, post, nextPost }) => (
    <>
      <SEO title="Posting" keywords={post.frontmatter.tags} />
      <Container>
        <Content>
          <MarkedHeader>{post.frontmatter.title}</MarkedHeader>
          <HeaderDate>
            {post.frontmatter.date}
          </HeaderDate>
          <Divider />
          <MarkDown dangerouslySetInnerHTML={{ __html: post.html }} />
          <div style={{ marginTop: '30px' }}>
            {prevPost && this.renderCard(prevPost, true)}
            {nextPost && this.renderCard(nextPost, false)}
          </div>
        </Content>
      </Container>
    </>
  );

  getPostings = () => {
    const { data } = this.props;
    const { pathname } = window.location;
    const endpoint = pathname.split('/').pop();
    const currentPage = pathname.split('/')[1];
    const postings = data.allMarkdownRemark.edges.filter(
      ele => ele.node.frontmatter.category === currentPage,
    );
    return postings.reduce((acc, posting, index, self) => {
      if (endpoint === posting.node.frontmatter.path.split('/').pop()) {
        acc.post = self[index].node;
        if (index !== 0) acc.nextPost = self[index - 1].node;
        if (index !== postings.length - 1) acc.prevPost = self[index + 1].node;
      }
      return acc;
    }, {});
  }

  render = () => {
    if (typeof window !== 'undefined') {
      const { prevPost, post, nextPost } = this.getPostings();
      return (
        <Layout>
          {this.renderPost({ prevPost, post, nextPost })}
        </Layout>
      );
    } return <></>;
  }
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          html
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

Template.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
};

export default Template;
