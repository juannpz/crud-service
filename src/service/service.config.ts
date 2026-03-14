import {
    DatabaseConfig,
    ServiceAuthConfig,
    ServiceConfig,
    ServicesEntrypoints,
} from "./service.definition.ts";
import { checkEnv } from "@juannpz/deno-service-tools";

function getConfig() {
    const config: ServiceConfig = {
        dbConfig: getDatabaseConfig(),
        servicesEntrypoints: getServicesEntrypoints(),
        authConfig: getServiceAuthConfig(),
    };

    return checkEnv(config);
}

function getDatabaseConfig(): DatabaseConfig {
    return {
        DB_HOST: Deno.env.get("DB_HOST") ?? "",
        DB_PORT: parseInt(Deno.env.get("DB_PORT") ?? ""),
        DB_USER: Deno.env.get("DB_USER") ?? "",
        DB_PASSWORD: Deno.env.get("DB_PASSWORD") ?? "",
        DB_NAME: Deno.env.get("DB_NAME") ?? "",
    };
}

function getServicesEntrypoints(): ServicesEntrypoints {
    return {
        SESSION_SERVICE: Deno.env.get("SESSION_SERVICE") ?? "",
    };
}

function getServiceAuthConfig(): ServiceAuthConfig {
    return {
        SERVICE_AUTH_USER_ID: Deno.env.get("SERVICE_AUTH_USER_ID") ?? "",
        SERVICE_AUTH_ROLE: Deno.env.get("SERVICE_AUTH_ROLE") ?? "",
        SERVICE_AUTH_PUBLIC_KEY: Deno.env.get("SERVICE_AUTH_PUBLIC_KEY") ?? "",
    };
}

export const SERVICE_CONFIG = getConfig();
