import { useEffect, useState, useCallback } from "react";
import WebSdk from "@holo-host/web-sdk";

interface AgentState {
  isAvailable: boolean;
  agentPubKey?: string;
  // ... add other fields if you need them
}

interface ListInput {
  hive_id: string;
  content_type: string;
}

/**
 * A production-friendly hook for:
 * 1) Connecting to the Holo Web SDK (no blocking loops)
 * 2) Tracking agent availability via event listeners
 * 3) Providing a built-in zome function call (with filtering/decoding)
 */
export function useHoloConnection() {
  // -- React State --
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string[]>([]);
  const [agentInfo, setAgentInfo] = useState<AgentState | null>(null);
  const [client, setClient] = useState<WebSdk | null>(null);

  // -- Connect to Holo on Mount --
  useEffect(() => {
    const connectToHolo = async () => {
      try {
        console.log("🔗 Connecting to Holo...");
        const holoClient = await WebSdk.connect({
          chaperoneUrl: "https://chaperone.holo.hosting",
          authFormCustomization: { appName: "humm-earth-core-happ" },
        });

        holoClient.on("agent-state", (agent_state: AgentState) => {
          setIsConnected(agent_state.isAvailable);
        });

        setAgentInfo(holoClient.agentState);
        setClient(holoClient);
  
        console.log("✅ Holo connection successful!", holoClient);
        console.log(await holoClient.appInfo());
      } catch (err: any) {
        handleError("Holo connection failed", err);
      }
    };

    connectToHolo();

    return () => {
      console.log("🛑 Cleaning up WebSocket connection...");
      setIsConnected(false);
    };
  }, []);

  // -- The core logic for calling the Zome function --
  const callZomeFunction = useCallback(async () => {
    if (!client) {
      handleError("WebSocket client is not set yet!");
      return;
    }

    console.log("✅ Client is set, proceeding with Zome call...");

    try {
      const listInput: ListInput = {
        hive_id: import.meta.env.VITE_HIVE_ID || "",
        content_type: "hummhive-extension-story-v1",
      };

      const result = await client.callZome({
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
      setData(publicContent);
    } catch (err: any) {
      handleError("Zome call failed", err);
    }
  }, [client]);

  // -- Automatically call the zome function once connected (no intervals) --
  useEffect(() => {
    if (isConnected && client) {
      console.log("🟢 WebSocket is connected! Waiting 10 seconds before first call...");
        callZomeFunction();
    } else {
      console.log("🛑 WebSocket is not ready yet...");
    }
    return () => {
    };
  }, [isConnected, client]);

  const handleError = (message: string, err?: any) => {
    console.error(`❌ ${message}`, err);
    const errorMessage = err?.message || err?.error || err?.data?.message || err?.details || JSON.stringify(err, null, 2);
    setError(`Error: ${errorMessage}`);
  };

  const filterObjectsWithReaderWildcard = (array: any[]): any[] => {
    return array.filter(item => item.encrypted_content?.header?.acl?.reader?.includes("*"));
  };

  const decodeContent = (array: any[]): string[] => {
    const textDecoder = new TextDecoder();
    return array.map(item => {
      const bytes = item.encrypted_content?.bytes;
      return bytes ? textDecoder.decode(bytes) : '';
    });
  };

  // -- Return everything needed by your components --
  return {
    isConnected,
    error,
    data,
    agentInfo,
  };
}
