import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWebSocket } from '../hooks/useWebSocket';

const Post: React.FC = () => {
  const { id } = useParams();
  const { data: posts } = useWebSocket('ws://localhost:8080');
  const post = posts[0];

  if (!post) return null;

  return (
    <>
      <Helmet>
        <title>{post.title} - HummHive</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="font-serif mb-4">{post.title}</h1>
        <div className="text-sm text-stone-400 dark:text-stone-500 mb-12 flex items-center gap-2 -mt-4">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
};

export default Post;