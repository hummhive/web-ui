import React from 'react';
import { Helmet } from 'react-helmet-async';
import PostCard from '../components/PostCard';
import { useWebSocket } from '../hooks/useWebSocket';

const Home: React.FC = () => {
  const { data: posts, agentInfo, isConnected, error } = useWebSocket();

  return (
    <>
      <Helmet>
        <title>HummHive Blog</title>
        <meta name="description" content="Sharing great stories" />
      </Helmet>

      <div className="space-y-12">
        <h1 className="text-4xl font-serif">Latest Stories</h1>
        
        <div className="text-sm text-gray-500">
          {isConnected ? (
            <div>
              <p>Connected to Holochain</p>
              <p>Agent ID: {agentInfo?.id}</p>
              <p>Agent Available: {agentInfo?.isAvailable ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p>Connecting to Holochain...</p>
          )}
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;