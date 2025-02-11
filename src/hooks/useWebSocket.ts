import { useEffect, useState, useCallback } from "react";
import WebSdk from "@holo-host/web-sdk";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const [client, setClient] = useState<WebSdk | null>(null);

  useEffect(() => {
    const connectToHolo = async () => {
      try {
        console.log("🔗 Connecting to Holo...");
        const holoClient = await WebSdk.connect({
          chaperoneUrl: "https://chaperone.holo.hosting",
          authFormCustomization: { appName: "humm-earth-core-happ" },
        });

        holoClient.on("agent-state", (agent_state: any) => {
          setIsConnected(agent_state.isAvailable);
        });

        setAgentInfo(holoClient.agentState);
        setClient(holoClient);
        setIsConnected(true);
        console.log("✅ Holo connection successful!", holoClient);
        console.log(await holoClient.appInfo());
      } catch (err: any) {
        console.error("❌ Holo connection failed!", err);
        setError(err.message);
      }
    };

    connectToHolo();

    return () => {
      console.log("🛑 Cleaning up WebSocket connection...");
      if (client) {
        // Close the client connection if it has a `close` method
        client.close?.();
      }
      setIsConnected(false);
    };
  }, []);

  const callZomeFunction = useCallback(async () => {
    console.log("⚡️ callZomeFunction triggered");
  
    if (!client) {
      console.error("❌ WebSocket client is not set yet!");
      setError("WebSocket is not connected.");
      return;
    }
  
    console.log("✅ Client is set, proceeding with Zome call...");
  
    try {
      const listInput = {
        hive_id: "MTczODA5MzYxMTIxMy03OTUyYmZmMmZmOGE4ZGI4",
        content_type: "hummhive-extension-story-v1",
      };
  
      console.log("📡 Calling Zome function with payload:", listInput);
  
      const result = await client.callZome({
        role_name: "humm_earth_core",
        zome_name: "content",
        fn_name: "list_by_hive_link",
        payload: listInput,
      });
  
      if (!result) {
        throw new Error("Zome call returned no data");
      }
  
      console.log("✅ Zome Function Result:", result);
      setData(result);
    } catch (err: any) {
      console.error("❌ Zome call failed!");
  
      // 🔥 Log the entire error object
      console.error("🔥 Full error object:", err);
  
      // 🔥 Try to get detailed error information
      const errorMessage =
        err?.message ||
        err?.error ||
        err?.data?.message ||
        err?.details ||
        JSON.stringify(err, null, 2);
  
      console.error("🔴 Extracted error message:", errorMessage);
  
      setError(`Zome call error: ${errorMessage}`);
    }
  }, [client]);

  useEffect(() => {
    if (isConnected && client) {
      console.log("🟢 WebSocket is connected! Triggering callZomeFunction...");
      callZomeFunction();
    } else {
      console.log("🛑 WebSocket is not ready yet...");
    }
  }, [isConnected, client, callZomeFunction]);

  return { isConnected, error, data, agentInfo };
};
