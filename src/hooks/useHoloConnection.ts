import { useEffect, useState } from "react";
import WebSdk from "@holo-host/web-sdk";

interface AgentState {
  isAvailable: boolean;
  agentPubKey?: string;
}

type UseHoloConnectionOutput = {
  holoClient: WebSdk | null;
  isConnected: boolean;
  error: string | null;
};

export function useHoloConnection(): UseHoloConnectionOutput {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<WebSdk | null>(null);

  useEffect(() => {
    const connectToHolo = async () => {
      try {
        console.log("🔗 Connecting to Holo...");
        const holoClient = await WebSdk.connect({
          chaperoneUrl: "https://chaperone.holo.hosting",
          authFormCustomization: { appName: "humm-earth-core-happ" },
        });

        holoClient.on("agent-state", (agent_state: AgentState) => {
          if (agent_state.isAvailable) {
            console.log("✅ Holo connection successful!", holoClient);

            setIsConnected(agent_state.isAvailable);
            setClient(holoClient);
          }
        });
      } catch (err: any) {
        handleError("Holo connection failed", err);
      }
    };

    connectToHolo();
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

  return {
    holoClient: client,
    isConnected,
    error,
  };
}
