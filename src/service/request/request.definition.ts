import { basicAuthMiddleware } from "../middleware/middleware.ts";
import { ServerBuilder } from "@juannpz/deno-server-tools";
import { test1Request } from "./v1/test/test1.request.ts";

const testRequest = [
    test1Request,
];

export function addTestRequest(server: ServerBuilder) {
    server.group('/v1/test', (app) => {
        testRequest.forEach(request => {
            request.useMiddleware(basicAuthMiddleware);
            
            request.register(app);
        });
    });
}