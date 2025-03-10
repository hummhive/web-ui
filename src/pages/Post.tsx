import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Builder from "../Builder";

type PostProps = {
  stories: any[];
  isConnected: boolean;
  isLoadingStories: boolean;
  error: any;
};

const Post: React.FC<PostProps> = ({
  stories,
  isLoadingStories, // TODO: we can use this to show a loading state
  isConnected,
  error,
}) => {
  const { id } = useParams<{ id: string }>();
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isConnected]);

  if (error) {
    return <div>❌ Error: {error}</div>;
  }

  if (!isConnected && stories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-y-2">
        <div className="flex items-center gap-x-2">
          <div className="w-4 h-4 border-2 border-t-transparent border-stone-400 rounded-full animate-spin"></div>
          <span>Connecting to Holo… Please wait.</span>
        </div>
        {showTimeoutMessage && (
          <div className="text-red-500 text-center">
            The site is taking longer than expected to connect. We’re aware of
            an issue on some browsers and recommend using Safari or Chrome. If
            you're still having trouble, try refreshing the page.
          </div>
        )}
      </div>
    );
  }

  const post = stories.find((post) => {
    try {
      const postObject = JSON.parse(post);
      return postObject.storyId === id;
    } catch (error) {
      console.error("Error parsing post:", error);
      return false;
    }
  });

  if (!post) return <div>Loading content...</div>;

  const postObject = JSON.parse(post);

  return (
    <>
      <Helmet>
        <title>{postObject.title} - HummHive</title>
        <meta name="description" content={postObject.excerpt} />
      </Helmet>

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="font-serif mb-4">{postObject.title}</h1>
        {JSON.parse(postObject.body).map((element: any, i: number) => (
          <Builder key={i} element={element} />
        ))}
      </article>
      {error && <p>Error: {error.message}</p>}
    </>
  );
};

export default Post;
