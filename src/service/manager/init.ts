import { ServiceTokenManager } from "@juannpz/deno-service-tools";
import { ServiceConfig } from "../service.definition.ts";
import { DatabaseManager } from "./DatabaseManager.ts";

export async function initManager(config: ServiceConfig) {
    await ServiceTokenManager.init({
        userId: config.authConfig.SERVICE_AUTH_USER_ID,
        role: config.authConfig.SERVICE_AUTH_ROLE,
        publicKey: config.authConfig.SERVICE_AUTH_PUBLIC_KEY,
    }, config.servicesEntrypoints.SESSION_SERVICE);

    DatabaseManager.init(config.dbConfig);
}
