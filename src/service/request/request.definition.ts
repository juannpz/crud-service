import { createUserRequest } from "./v1/user/createUser.request.ts";
import { basicAuthMiddleware } from "../middleware/middleware.ts";
import { getUserRequest } from "./v1/user/getUser.request.ts";
import { ServerBuilder } from "@juannpz/deno-service-tools";
import { test1Request } from "./v1/test/test1.request.ts";

export function addRequest(server: ServerBuilder) {
    addTestRequest(server);
    addUserRequest(server);
}

const testRequest = [test1Request];
const userRequest = [getUserRequest, createUserRequest];

function addTestRequest(server: ServerBuilder) {
    server.group('/v1/test', (app) => {
        testRequest.forEach(request => {
            request.useMiddleware(basicAuthMiddleware);
            
            request.register(app);
        });
    });
}

function addUserRequest(server: ServerBuilder) {
    server.group('/v1/crud', (app) => {
        userRequest.forEach(request => {
            request.useMiddleware(basicAuthMiddleware);
            
            request.register(app);
        });
    });
}