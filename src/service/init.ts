import { addRequest, IContextVariables } from "./request/request.definition.ts";
import { createServer } from "@juannpz/deno-service-tools";
import { initManager } from "./manager/manager.config.ts";
import { getConfig } from "./service.config.ts";

const server = createServer<IContextVariables>();

export function init() {
    const config = getConfig();

    initManager(config);

    addRequest(server);

    server.start();
}