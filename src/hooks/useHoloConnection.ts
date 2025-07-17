import { useEffect, useState, useRef, useCallback } from "react";

// Cache configuration
const CACHE_KEY = 'holo_stories_cache';
const CACHE_TIMESTAMP_KEY = 'holo_stories_timestamp';
const CACHE_HASH_KEY = 'holo_stories_hash';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const BACKGROUND_CHECK_INTERVAL = 2 * 60 * 1000; // 2 minutes

class HoloCacheManager {
  static setCache(stories, hash = null) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(stories));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      if (hash) {
        localStorage.setItem(CACHE_HASH_KEY, hash);
      }
      console.log('✅ Stories cached to localStorage');
    } catch (error) {
      console.warn('⚠️ Failed to save to localStorage:', error);
    }
  }

  static getCache() {
    try {
      const stories = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const hash = localStorage.getItem(CACHE_HASH_KEY);
      
      if (!stories || !timestamp) return null;
      
      const parsedStories = JSON.parse(stories);
      const age = Date.now() - parseInt(timestamp);
      
      return {
        stories: parsedStories,
        timestamp: parseInt(timestamp),
        hash,
        age,
        isFresh: age < CACHE_DURATION,
        isStale: age >= CACHE_DURATION
      };
    } catch (error) {
      console.warn('⚠️ Failed to read from localStorage:', error);
      return null;
    }
  }

  static clearCache() {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      localStorage.removeItem(CACHE_HASH_KEY);
      console.log('🗑️ Cache cleared');
    } catch (error) {
      console.warn('⚠️ Failed to clear localStorage:', error);
    }
  }

  static generateHash(data) {
    // Simple hash function for comparing data changes - safe for Unicode
    const str = JSON.stringify(data);
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36); // Base36 for shorter string
  }
}

export function useHoloConnection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stories, setStories] = useState<string[]>([]);
  const [cacheStatus, setCacheStatus] = useState<'fresh' | 'stale' | 'loading' | 'error'>('loading');
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isBackgroundFetching, setIsBackgroundFetching] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const backgroundCheckRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);
  const fetchInProgressRef = useRef(false);

  const buildApiUrl = useCallback(() => {
    try {
      const inputObj = {
        hive_id: import.meta.env.VITE_HIVE_ID || "MTc0MTA4ODg5NDA5Ni1iZmVjZGEwZDUxYTMxMjgz",
        content_type: "hummhive-extension-story-v1"
      };
      const jsonString = JSON.stringify(inputObj);
      
      // Ensure the JSON string only contains ASCII characters for btoa()
      const payload = btoa(unescape(encodeURIComponent(jsonString)));
      
      return `https://gateway.web-bridge.holo.host/uhC0kHOLVvxbFaeXLTDf65cVYrPDjjVeenRwHtkIqF0Oa-SzBv7gN/685c2ea77b2cb237d498f021/content/list_by_hive_link?payload=${payload}`;
    } catch (error) {
      console.error('Error building API URL:', error);
      throw new Error('Failed to build API URL');
    }
  }, []);

  const handleError = (message: string, err?: any) => {
    console.error(`❌ ${message}`, err);
    const errorMessage =
      err?.message ||
      err?.error ||
      err?.data?.message ||
      err?.details ||
      JSON.stringify(err, null, 2);
    setError(`Error: ${errorMessage}`);
  };

  const filterObjectsWithReaderWildcard = (array: any[]): any[] => {
    return array.filter(item => item.encrypted_content?.header?.acl?.reader?.includes("*"));
  };

  const decodeContent = (array: any[]): string[] => {
    const textDecoder = new TextDecoder();
    return array.map(item => {
      const bytes = item.encrypted_content?.bytes;
      console.log("🔍 Bytes:", bytes);
      if (bytes && Array.isArray(bytes)) {
        return textDecoder.decode(Uint8Array.from(bytes));
      } else if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        return textDecoder.decode(bytes);
      }
      return '';
    });
  };

  // Check if new data is available (lightweight check)
  const checkForUpdates = useCallback(async (silent = true): Promise<boolean> => {
    try {
      const cache = HoloCacheManager.getCache();
      if (!cache) return true; // No cache, need to fetch

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const apiUrl = buildApiUrl();

      // Make a HEAD request first to check if anything changed
      const response = await fetch(apiUrl, {
        method: 'HEAD',
        signal: abortControllerRef.current.signal,
      });

      // If we can't do HEAD request, assume changes (some APIs don't support HEAD)
      if (response.status === 405) {
        return true;
      }

      // Check headers for changes (if available)
      const lastModified = response.headers.get('Last-Modified');
      const etag = response.headers.get('ETag');
      
      if (lastModified || etag) {
        // Server supports conditional requests
        return true; // Let the main fetch handle conditional logic
      }

      // Fallback: if cache is stale, assume updates
      return cache.isStale;
    } catch (error) {
      if (error.name !== 'AbortError' && !silent) {
        console.warn('🔄 Update check failed:', error);
      }
      return false;
    }
  }, [buildApiUrl]);

  const fetchData = useCallback(async (options: { 
    forceRefresh?: boolean; 
    silent?: boolean; 
    useCache?: boolean 
  } = {}) => {
    const { forceRefresh = false, silent = false, useCache = true } = options;

    // Prevent concurrent fetches unless it's a force refresh
    if (fetchInProgressRef.current && !forceRefresh) {
      console.log('🚫 Fetch already in progress, skipping...');
      return;
    }

    try {
      fetchInProgressRef.current = true;
      console.log(`🚀 fetchData called - silent: ${silent}, forceRefresh: ${forceRefresh}, useCache: ${useCache}`);
      
      if (!silent) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsBackgroundFetching(true);
      }

      // Check cache first
      const cache = HoloCacheManager.getCache();
      if (useCache && cache && !forceRefresh) {
        if (cache.isFresh) {
          console.log('📦 Using fresh cache');
          setStories(cache.stories);
          setCacheStatus('fresh');
          setLastUpdated(cache.timestamp);
          if (!silent) setIsLoading(false);
          if (silent) setIsBackgroundFetching(false);
          fetchInProgressRef.current = false;
          
          return cache.stories;
        } else if (cache.isStale) {
          console.log('📦 Using stale cache, will fetch fresh data');
          setStories(cache.stories);
          if (!silent) {
            setCacheStatus('stale');
            setLastUpdated(cache.timestamp);
          }
          // Continue to fetch fresh data below
        }
      }

      console.log("🔗 Fetching data from Holo API...");
      
      const apiUrl = buildApiUrl();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add conditional headers if we have cache
      if (cache?.hash && !forceRefresh) {
        headers['If-None-Match'] = `"${cache.hash}"`;
      }

      let response: Response;
      let fetchController: AbortController | null = null;

      try {
        // Try with AbortController first
        fetchController = new AbortController();
        
        const fetchWithTimeout = async () => {
          const timeoutId = setTimeout(() => {
            if (fetchController) {
              fetchController.abort();
            }
          }, 15000);

          try {
            const resp = await fetch(apiUrl, {
              method: "GET",
              headers,
              signal: fetchController?.signal,
            });
            clearTimeout(timeoutId);
            return resp;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        };

        response = await fetchWithTimeout();
      } catch (fetchError) {
        // If AbortController fails, try without it
        if (fetchError.name === 'AbortError' || fetchError.message.includes('abort')) {
          console.log('🔄 Retrying fetch without AbortController...');
          
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout after 20 seconds')), 20000)
          );
          
          const fetchPromise = fetch(apiUrl, {
            method: "GET",
            headers,
          });

          response = await Promise.race([fetchPromise, timeoutPromise]);
        } else {
          throw fetchError;
        }
      }

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result || !Array.isArray(result)) {
        throw new Error("API returned no data or invalid format");
      }

      const filteredData = filterObjectsWithReaderWildcard(result);
      const publicContent = decodeContent(filteredData);
      
      // Generate hash for change detection
      const dataHash = HoloCacheManager.generateHash(publicContent);
      
      // Check if data actually changed
      if (cache?.hash === dataHash && !forceRefresh) {
        console.log('📦 Data unchanged, updating cache timestamp');
        HoloCacheManager.setCache(cache.stories, dataHash);
        setCacheStatus('fresh');
        setLastUpdated(Date.now());
      } else {
        // Data changed or no cache, update everything
        console.log('✨ New data received, updating cache');
        HoloCacheManager.setCache(publicContent, dataHash);
        setStories(publicContent);
        setCacheStatus('fresh');
        setLastUpdated(Date.now());
      }

      // Clean up loading states
      setIsLoading(false);
      setIsBackgroundFetching(false);
      fetchInProgressRef.current = false;
      
      return publicContent;

    } catch (err: any) {
      fetchInProgressRef.current = false;
      
      if (err.name === 'AbortError') {
        console.log('🚫 Request aborted');
        setIsLoading(false);
        setIsBackgroundFetching(false);
        return;
      }

      console.error('❌ Fetch failed:', err);
      
      // Always clear loading states on error
      setIsLoading(false);
      setIsBackgroundFetching(false);

      // Only show error if this wasn't a silent background request
      if (!silent) {
        handleError("API request failed", err);
      }

      // Fallback to cache if available and this isn't the initial load
      const cache = HoloCacheManager.getCache();
      if (cache && (stories.length > 0 || hasInitialized.current)) {
        console.log('📦 Using cached data due to fetch error');
        setStories(cache.stories);
        setCacheStatus(silent ? 'fresh' : 'error'); // Don't show error status for background failures
        setLastUpdated(cache.timestamp);
        return cache.stories;
      }

      if (!silent) {
        setCacheStatus('error');
      }
      throw err;
    }
  }, [buildApiUrl, handleError, stories.length]);

  // Initial load with cache
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeData = async () => {
      try {
        await fetchData({ useCache: true });
      } catch (error) {
        console.error('Initial load failed:', error);
      }
    };

    initializeData();

    // Setup background checks
    backgroundCheckRef.current = setInterval(async () => {
      if (document.visibilityState === 'visible' && !fetchInProgressRef.current) {
        console.log('🔄 Background check starting...');
        const hasUpdates = await checkForUpdates(true);
        if (hasUpdates && !fetchInProgressRef.current) {
          console.log('📥 Updates detected, fetching in background...');
          setCacheStatus('stale'); // Show updating status
          try {
            await fetchData({ silent: true });
            console.log('✅ Background update completed');
          } catch (error) {
            console.warn('❌ Background update failed:', error);
            // Don't change status on background failure, keep showing cached data
          }
        } else {
          console.log('✅ No updates needed or fetch in progress');
        }
      }
    }, BACKGROUND_CHECK_INTERVAL);

    // Check when page becomes visible
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page visible, checking for updates...');
        const cache = HoloCacheManager.getCache();
        if (cache?.isStale) {
          console.log('⏰ Cache is stale, checking for updates...');
          setCacheStatus('stale'); // Show updating status
          const hasUpdates = await checkForUpdates(true);
          if (hasUpdates) {
            console.log('📥 Updates found, fetching...');
            try {
              await fetchData({ silent: true });
              console.log('✅ Visibility update completed');
            } catch (error) {
              console.warn('❌ Visibility update failed:', error);
              setCacheStatus('error');
            }
          } else {
            console.log('✅ No updates on visibility change');
            setCacheStatus('fresh'); // Reset to fresh if no updates needed
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (backgroundCheckRef.current) {
        clearInterval(backgroundCheckRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, checkForUpdates]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    try {
      await fetchData({ forceRefresh: true });
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  }, [fetchData]);

  // Clear cache function
  const clearCache = useCallback(() => {
    HoloCacheManager.clearCache();
    setStories([]);
    setCacheStatus('loading');
    setLastUpdated(null);
    fetchData({ forceRefresh: true, useCache: false });
  }, [fetchData]);

  return {
    isLoading,
    error,
    stories,
    cacheStatus,
    lastUpdated,
    isBackgroundFetching,
    refresh,
    clearCache,
    checkForUpdates: () => checkForUpdates(false),
  };
}