import { IAuthConfig, IServiceConfig, IServiceUrls } from "./service.definition.ts";
import { checkEnv } from "./service.util.ts";

export function getConfig(): IServiceConfig {
    const config: IServiceConfig = {
        authConfig: getAuthConfig(),
        serviceUrls: getServiceUrls()
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