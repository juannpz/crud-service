import { addTestRequest } from "./request/request.definition.ts";
import { initManager } from "./manager/manager.config.ts";
import { createServer } from '@juannpz/deno-server-tools';
import { getConfig } from "./service.config.ts";

const server = createServer();

export function init() {
    const config = getConfig();

    initManager(config);

    addTestRequest(server);

    server.start();
}