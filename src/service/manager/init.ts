import { IServiceConfig } from "../service.definition.ts";
import { JWTManager } from "@juannpz/deno-service-tools";
import { DatabaseManager } from "./DatabaseManager.ts";

export function initManager(config: IServiceConfig) {
    JWTManager.init(config.authConfig.JWT_KEY);

    DatabaseManager.init(config.dbConfig);
}