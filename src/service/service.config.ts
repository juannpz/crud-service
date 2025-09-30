import { AuthConfig, DatabaseConfig, ServiceConfig, ServiceUrls } from "./service.definition.ts";
import { checkEnv } from "@juannpz/deno-service-tools";

export function getConfig() {
    const config: ServiceConfig = {
        authConfig: getAuthConfig(),
        serviceUrls: getServiceUrls(),
        dbConfig: getDatabaseConfig()
    };

    return checkEnv(config);
}

function getAuthConfig(): AuthConfig {
    return {
        JWT_KEY: Deno.env.get("JWT_KEY") ?? ""
    };
}

function getServiceUrls(): ServiceUrls {
    return {
        BROKER_SERVICE_URL: Deno.env.get("BROKER_SERVICE_URL") ?? ""
    };
}

function getDatabaseConfig(): DatabaseConfig {
    return {
        DB_HOST: Deno.env.get("DB_HOST") ?? "",
        DB_PORT: parseInt(Deno.env.get("DB_PORT") ?? ""),
        DB_USER: Deno.env.get("DB_USER") ?? "",
        DB_PASSWORD: Deno.env.get("DB_PASSWORD") ?? "",
        DB_NAME: Deno.env.get("DB_NAME") ?? ""
    };
}