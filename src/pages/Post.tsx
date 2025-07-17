import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTheme } from "../context/ThemeContext";
import { useHoloConnection } from "../hooks/useHoloConnection";
import Builder from "../Builder";

interface PostProps {
  // Remove these props since we're now using the hook directly
  // stories: any[];
  // isLoading: boolean;
  // error: any;
}

const Post: React.FC<PostProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { 
    stories, 
    isLoading, 
    error, 
    cacheStatus, 
    lastUpdated, 
    refresh, 
    clearCache 
  } = useHoloConnection();
  
  const [showDelayMessage, setShowDelayMessage] = useState(false);

  useEffect(() => {
    // Only show delay message if we're loading and have no cached data
    if (isLoading && stories.length === 0) {
      const timer = setTimeout(() => {
        setShowDelayMessage(true);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowDelayMessage(false);
    }
  }, [isLoading, stories.length]);

  const formatLastUpdated = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Cache status indicator
  const CacheStatusIndicator = () => {
    switch (cacheStatus) {
      case 'fresh':
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Connected to Holo</span>
          </div>
        );
      case 'stale':
        return (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Updating...</span>
          </div>
        );
      case 'loading':
        return (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Loading...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Offline mode</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Show error only if we have no stories at all
  if (error && stories.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-red-600">❌ {error}</div>
        <div className="flex gap-2">
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Show loading state only if no cached data available
  if (isLoading && stories.length === 0) {
    return (
      <div className="flex flex-col items-start gap-y-2">
        <div className="flex items-center gap-x-2">
          <div className="w-4 h-4 border-2 border-t-transparent border-stone-400 rounded-full animate-spin"></div>
          <span>Connecting to Holo… Please wait.</span>
        </div>
        {showDelayMessage && (
          <p className="text-sm text-stone-600">
            The site is taking longer than expected to connect. We're aware of
            an issue on some browsers and recommend using Safari or Chrome. If
            you're still having trouble, try refreshing the page.
          </p>
        )}
      </div>
    );
  }

  // Find the specific post
  const post = stories.find((post) => {
    try {
      const postObject = JSON.parse(post);
      return postObject.storyId === id;
    } catch (error) {
      console.error("Error parsing post:", error);
      return false;
    }
  });

  // Show post not found message if we have stories but not this specific post
  if (stories.length > 0 && !post) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif">Post Not Found</h1>
          <CacheStatusIndicator />
        </div>
        
        {/* Background loading indicator */}
        {isLoading && cacheStatus === 'stale' && (
          <div className="flex items-center gap-2 text-sm text-stone-500 bg-blue-50 border border-blue-200 p-3 rounded">
            <div className="w-3 h-3 border border-t-transparent border-blue-400 rounded-full animate-spin"></div>
            <span>Fetching latest updates from Holo...</span>
          </div>
        )}

        {/* Error banner for background errors */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ Connection issue detected
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Showing cached content from Holo. This post might not be available or outdated.
                </p>
              </div>
              <button 
                onClick={refresh}
                className="text-sm text-yellow-800 hover:text-yellow-900 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <div className="text-center py-12">
          <p className="text-stone-500 mb-4">
            The requested post could not be found. It may have been moved or deleted.
          </p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded text-stone-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh Content'}
          </button>
        </div>
      </div>
    );
  }

  // Show loading if still searching for the post
  if (!post) {
    return (
      <div className="flex flex-col items-center gap-y-2">
        <div className="flex items-center gap-x-2">
          <div className="w-4 h-4 border-2 border-t-transparent border-stone-400 rounded-full animate-spin"></div>
          <span>Loading content...</span>
        </div>
      </div>
    );
  }

  const postObject = JSON.parse(post);

  return (
    <>
      <Helmet>
        <title>{postObject.title} - HummHive</title>
        <meta name="description" content={postObject.excerpt} />
      </Helmet>

      <div className="space-y-6">
        {/* Header with cache status */}
        <div className="flex justify-end pb-4 dark:border-stone-700">
          <CacheStatusIndicator />
        </div>

        {/* Background loading indicator */}
        {isLoading && stories.length > 0 && cacheStatus === 'stale' && (
          <div className="flex items-center gap-2 text-sm text-stone-500 bg-blue-50 border border-blue-200 p-3 rounded">
            <div className="w-3 h-3 border border-t-transparent border-blue-400 rounded-full animate-spin"></div>
            <span>Fetching latest updates from Holo...</span>
          </div>
        )}

        {/* Error banner for background errors */}
        {error && stories.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ Connection issue detected
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Showing cached content from Holo. This post might be outdated.
                </p>
              </div>
              <button 
                onClick={refresh}
                className="text-sm text-yellow-800 hover:text-yellow-900 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Post content */}
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="font-serif mb-4">{postObject.title}</h1>
          {JSON.parse(postObject.body).map((element: any, i: number) => (
            <Builder key={i} element={element} />
          ))}
        </article>
      </div>
    </>
  );
};

export default Post;