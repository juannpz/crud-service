import { JWTManager } from "@juannpz/deno-server-tools";
import { IServiceConfig } from "../service.definition.ts";

export function initManager(config: IServiceConfig) {
    JWTManager.init(config.authConfig.JWT_KEY);
}