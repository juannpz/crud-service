import { addRequest, ExtendedContextVariables } from "./request/request.definition.ts";
import { createServer } from "@juannpz/deno-service-tools";
import { SERVICE_CONFIG } from "./service.config.ts";
import { initManager } from "./manager/init.ts";

const server = createServer<ExtendedContextVariables>();

export async function init() {
    await initManager(SERVICE_CONFIG);

    addRequest(server, SERVICE_CONFIG);

    server.start();
}
