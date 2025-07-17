import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useHoloConnection } from "../hooks/useHoloConnection"; // Your enhanced hook

interface HomeProps {
  // Remove these props since we're now using the hook directly
  // stories: any[];
  // isLoading: boolean;
  // error: any;
}

const Home: React.FC<HomeProps> = () => {
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

  const formatter = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date
      .toLocaleString("default", { month: "long" })
      .toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

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

  const sortedData = stories.sort((a, b) => {
    try {
      const dateA = new Date(
        JSON.parse(a).shareConfig.website.sharedAt
      ).getTime();
      const dateB = new Date(
        JSON.parse(b).shareConfig.website.sharedAt
      ).getTime();
      return dateB - dateA;
    } catch (error) {
      console.error("Error sorting posts:", error);
      return 0;
    }
  });

  return (
    <>
      <Helmet>
        <title>HummHive Blog</title>
        <meta name="description" content="Sharing great stories" />
      </Helmet>

      <div className="space-y-12">
        <div className="space-y-8">
          {stories.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-4xl font-serif">Latest Stories</h1>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
                  <CacheStatusIndicator />
                  
  
                  
                  <div className="flex gap-2">
        
                  </div>
                </div>
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
                        Showing cached content from Holo. Some stories might be outdated.
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

              {sortedData.map((post, index) => {
                try {
                  const postObject = JSON.parse(post);
                  const bodyArray = JSON.parse(postObject.body);
                  const paragraph = bodyArray.find(
                    (e: { type: string; children: { text: string }[] }) =>
                      e.type === "p" && e.children[0]?.text !== ""
                  );
                  
                  return (
                    <article
                      className={`group py-8 first:pt-0 border-b ${theme.border} last:border-0 post-${index}`}
                      key={postObject.storyId || index}
                    >
                      <Link
                        to={`/post/${postObject.storyId}`}
                        className="block group-hover:opacity-70 transition-opacity"
                      >
                        <h2 className="text-2xl font-serif mb-2">
                          {postObject.title}
                        </h2>
                        <div className="text-sm text-stone-400 dark:text-stone-500 mb-3 flex items-center gap-2">
                          <span>
                            {formatter(postObject.shareConfig.website.sharedAt)}
                          </span>
                          <span>·</span>
                          <span>HummHive Team</span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                          {paragraph?.children[0]?.text || 'No preview available'}
                        </p>
                      </Link>
                    </article>
                  );
                } catch (error) {
                  console.error("Error parsing post:", error);
                  return null;
                }
              })}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-500">No stories available from Holo</p>
              <button 
                onClick={refresh}
                className="mt-4 px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded text-stone-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Try Loading Again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;