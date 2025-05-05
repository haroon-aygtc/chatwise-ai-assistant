
import { apiRequest } from "./base";

interface ServerInfo {
  appName: string;
  version: string;
  environment: string;
  phpVersion: string;
  laravelVersion: string;
  serverOs: string;
  database: string;
  config: Record<string, any>;
}

export const getServerInfo = async (): Promise<ServerInfo> => {
  return apiRequest<ServerInfo>({
    method: "GET",
    url: "/debug/server-info",
  });
};

export const getEnvVariables = async (): Promise<Record<string, string>> => {
  return apiRequest<Record<string, string>>({
    method: "GET",
    url: "/debug/env-variables",
  });
};

export const getCorsConfig = async (): Promise<Record<string, any>> => {
  return apiRequest<Record<string, any>>({
    method: "GET",
    url: "/debug/cors-config",
  });
};
