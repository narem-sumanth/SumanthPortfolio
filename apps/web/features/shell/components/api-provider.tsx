"use client";

import { createContext, useContext, useMemo } from "react";
import { createApiClient } from "@portfolio/api-client";

type ApiClient = ReturnType<typeof createApiClient>;

const ApiContext = createContext<ApiClient | null>(null);

export function ApiProvider({ baseUrl, children }: { baseUrl: string; children: React.ReactNode }) {
  const client = useMemo(() => createApiClient({ baseUrl }), [baseUrl]);
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}

export function useApiClient(): ApiClient {
  const client = useContext(ApiContext);
  if (!client) throw new Error("useApiClient must be used within ApiProvider");
  return client;
}
