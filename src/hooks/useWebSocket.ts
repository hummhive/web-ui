import { useEffect, useState } from "react";
import WebSdk from "@holo-host/web-sdk";
import { AppCallZomeRequest, RoleNameCallZomeRequest } from "@holochain/client";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const [client, setClient] = useState<WebSdk | null>(null); // ✅ Store client in state

  useEffect(() => {
    const connectToHolo = async () => {
      try {
        console.log("Connecting to Holo...");
        const holoClient = await WebSdk.connect({
          chaperoneUrl: "https://chaperone.holo.hosting",
          authFormCustomization: {
            appName: "humm-earth-core-happ",
          },
        });

        holoClient.on("agent-state", (agent_state: any) => {
          setIsConnected(agent_state.isAvailable);
        });

        setAgentInfo(holoClient.agentState);
        setClient(holoClient); // ✅ Store the client instance in state
        setIsConnected(true);
        console.log("Holo connection successful!", holoClient);
        console.log(await holoClient.appInfo());
      } catch (err: any) {
        console.error("Holo connection failed!", err);
        setError(err.message);
      }
    };

    connectToHolo();

    return () => {
      if (client) {
        console.log("Closing Holo client connection...");
        // client.close?.(); // Ensure the client disconnects if necessary
      }
      setIsConnected(false);
    };
  }, []);

  const callZomeFunction = async () => {
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

      // Call Zome function with better error handling
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
    } catch (err) {
      console.error("❌ Zome call failed!", err);
      setError(
        `Zome call error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  // ✅ Automatically call callZomeFunction when connected
  useEffect(() => {
    if (isConnected && client) {
      console.log("🟢 WebSocket is connected! Triggering callZomeFunction...");
      callZomeFunction();
    } else {
      console.log("🛑 WebSocket is not ready yet...");
    }
  }, [isConnected, client]);

  return { isConnected, error, data, agentInfo };
};
