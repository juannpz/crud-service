import { IAuthConfig, IDatabaseConfig, IServiceConfig, IServiceUrls } from "./service.definition.ts";
import { checkEnv } from "@juannpz/deno-service-tools";

export function getConfig() {
    const config: IServiceConfig = {
        authConfig: getAuthConfig(),
        serviceUrls: getServiceUrls(),
        dbConfig: getDatabaseConfig()
    }

    return checkEnv(config);
}

function getAuthConfig(): IAuthConfig {
    return {
        JWT_KEY: Deno.env.get('JWT_KEY') ?? ''
    };
}

function getServiceUrls(): IServiceUrls {
    return {
        BROKER_SERVICE_URL: Deno.env.get('BROKER_SERVICE_URL') ?? ''
    };
}

function getDatabaseConfig(): IDatabaseConfig {
    return {
        DB_HOST: Deno.env.get('DB_HOST') ?? '',
        DB_PORT: parseInt(Deno.env.get('DB_PORT') ?? ''),
        DB_USER: Deno.env.get('DB_USER') ?? '',
        DB_PASSWORD: Deno.env.get('DB_PASSWORD') ?? '',
        DB_NAME: Deno.env.get('DB_NAME') ?? ''
    };
}