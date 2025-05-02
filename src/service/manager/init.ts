import { IServiceConfig } from "../service.definition.ts";
import { JWTManager } from "@juannpz/deno-service-tools";
import { DatabaseManager } from "./DatabaseManager.ts";

export async function initManager(config: IServiceConfig) {
    JWTManager.init(config.authConfig.JWT_KEY);

    await DatabaseManager.init(config.dbConfig);
}