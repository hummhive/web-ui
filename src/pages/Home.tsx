import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface WebSocketData {
  data: any[];
  agentInfo: any;
  isConnected: boolean;
  error: any;
}

const Home: React.FC<WebSocketData> = ({ data, isConnected, error }) => {
  const { theme, setTheme } = useTheme();
  const [showDelayMessage, setShowDelayMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelayMessage(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  const formatter = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (error) {
    return <div>❌ Error: {error}</div>;
  }

  if (!isConnected && data.length === 0) {
    return (
      <div className="flex flex-col items-start gap-y-2">
        <div className="flex items-center gap-x-2">
          <div className="w-4 h-4 border-2 border-t-transparent border-stone-400 rounded-full animate-spin"></div>
          <span>Connecting to Holo… Please wait.</span>
        </div>
        {showDelayMessage && (
          <p className="text-sm text-stone-600">
The site is taking longer than expected to connect. We're aware of an issue on some browsers and recommend using Safari or Chrome. If you're still having trouble, try refreshing the page.
          </p>
        )}
      </div>
    );
  }

  const sortedData = data.sort((a, b) => {
    const dateA = new Date(JSON.parse(a).shareConfig.website.sharedAt).getTime();
    const dateB = new Date(JSON.parse(b).shareConfig.website.sharedAt).getTime();
    return dateB - dateA;
  });

  return (
    <>
      <Helmet>
        <title>HummHive Blog</title>
        <meta name="description" content="Sharing great stories" />
      </Helmet>

      <div className="space-y-12">
        <div className="space-y-8">
          {isConnected && data.length > 0 ? (
            <>
              <h1 className="text-3xl md:text-4xl font-serif">Latest Stories</h1>
              {sortedData.map((post, index) => {
                try {
                  const postObject = JSON.parse(post);
                  const bodyArray = JSON.parse(postObject.body);
                  const paragraph = bodyArray.find(
                    (e: { type: string; children: { text: string }[] }) => e.type === 'p' && e.children[0]?.text !== ''
                  );
                  return (
                    <article className={`group py-6 md:py-8 first:pt-0 border-b ${theme.border} last:border-0 post-${index}`} key={index}>
                      <Link to={`/post/${postObject.storyId}`} className="block group-hover:opacity-70 transition-opacity">
                        <h2 className="text-xl md:text-2xl font-serif mb-2">{postObject.title}</h2>
                        <div className="text-xs md:text-sm text-stone-400 dark:text-stone-500 mb-2 md:mb-3 flex items-center gap-2">
                          <span>{formatter(postObject.shareConfig.website.sharedAt)}</span>
                          <span>·</span>
                          <span>HummHive Team</span>
                        </div>
                        <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                          {paragraph.children[0].text}
                        </p>
                      </Link>
                    </article>
                  );
                } catch (error) {
                  console.error("Error parsing post:", error);
                  return null; // or handle the error as needed
                }
              })}
            </>
          ) : (
            <p>Connected… loading content.</p>
          )}
          {error && <p>The site is taking longer than expected to connect. We're aware of an issue on some browsers and recommend using Safari or Chrome. If you're still having trouble, try refreshing the page.</p>}
        </div>
      </div>
    </>
  );
};

export default Home;
