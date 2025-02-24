import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Builder from "../Builder";

interface WebSocketData {
  data: any[];
  agentInfo: any;
  isConnected: boolean;
  error: any;
}

const Post: React.FC<WebSocketData> = ({ data, isConnected, error  }) => {
  const { id } = useParams<{ id: string }>();
  if (error) {
    return <div>❌ Error: {error}</div>;
  }

  if (!isConnected) {
    return <div>Connecting to Holo… Please wait.</div>;
  }

  const post = data.find((post) => {
    try {
      const postObject = JSON.parse(post);
      return postObject.storyId === id;
    } catch (error) {
      console.error('Error parsing post:', error);
      return false;
    }
  });

  if (!post) return <div>Post not found</div>;

  const postObject = JSON.parse(post);

  return (
    <>
      <Helmet>
        <title>{postObject.title} - HummHive</title>
        <meta name="description" content={postObject.excerpt} />
      </Helmet>

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="font-serif mb-4">{postObject.title}</h1>
        {JSON.parse(postObject.body).map((element, i) => (
              <Builder key={i} element={element} />
            ))}
      </article>
      {error && <p>Error: {error.message}</p>}
    </>
  );
};

export default Post;