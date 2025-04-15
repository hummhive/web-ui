import { useEffect, useState } from "react";

export function useHoloConnection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stories, setStories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log("🔗 Fetching data from Holo API...");
        
        // Create input object matching the curl command
        const inputObj = {
          hive_id: import.meta.env.VITE_HIVE_ID || "MTc0MTA4ODg5NDA5Ni1iZmVjZGEwZDUxYTMxMjgz",
          content_type: "hummhive-extension-story-v1"
        };
        
        // Create JSON string without newlines (equivalent to echo -n)
        const jsonString = JSON.stringify(inputObj);
        
        // Base64 encode the JSON string (equivalent to base64 -i -w0)
        const payload = btoa(jsonString);
        
        // Use the API URL structure from the curl command
        const apiUrl = `https://${import.meta.env.VITE_WEB_BRIDGE_URL}/content/list_by_hive_link?payload=${payload}`;
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result || !Array.isArray(result)) {
          throw new Error("API returned no data or invalid format");
        }
        const filteredData = filterObjectsWithReaderWildcard(result);
        const publicContent = decodeContent(filteredData);
        setStories(publicContent);
      } catch (err: any) {
        handleError("API request failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  return {
    isLoading,
    error,
    stories,
  };
}
