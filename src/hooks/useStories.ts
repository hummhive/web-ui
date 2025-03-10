import { useEffect, useState } from "react";
import WebSdk from "@holo-host/web-sdk";

type UseStoriesOutput = {
  isFetching: boolean;
  stories: any[];
  error: string | null;
};

type ListInput = {
  hive_id: string;
  content_type: string;
};

export function useStories(holoClient: WebSdk | null): UseStoriesOutput {
  const [stories, setStories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // dont fetch stories if they are already fetched or if holoClient is not set
    if (!holoClient || stories.length > 0 || isFetching) return;

    fetchStories();
  }, [holoClient]);

  const fetchStories = async () => {
    if (!holoClient) {
      handleError("WebSocket holoClient is not set yet!");
      return;
    }

    setIsFetching(true);

    console.log("✅ Client is set, proceeding with Zome call...");

    try {
      const listInput: ListInput = {
        hive_id: import.meta.env.VITE_HIVE_ID || "",
        content_type: "hummhive-extension-story-v1",
      };
      const result = await holoClient.callZome({
        role_name: "humm_earth_core",
        zome_name: "content",
        fn_name: "list_by_hive_link",
        payload: listInput,
      });

      if (!result) {
        throw new Error("Zome call returned no data");
      }

      const filteredData = filterObjectsWithReaderWildcard(result);
      const publicContent = decodeContent(filteredData);

      setStories(publicContent);
      setIsFetching(false);
    } catch (err: any) {
      handleError("Zome call failed", err);
      setIsFetching(false);
    }
  };

  const filterObjectsWithReaderWildcard = (array: any[]): any[] => {
    return array.filter((item) =>
      item.encrypted_content?.header?.acl?.reader?.includes("*")
    );
  };

  const decodeContent = (array: any[]): string[] => {
    const textDecoder = new TextDecoder();
    return array.map((item) => {
      const bytes = item.encrypted_content?.bytes;
      return bytes ? textDecoder.decode(bytes) : "";
    });
  };

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

  return { isFetching, stories, error };
}
