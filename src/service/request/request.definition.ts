import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { basicAuthMiddleware } from "../middleware/middleware.ts";
import { postUserRequest } from "./v1/users/postUser.request.ts";
import { getUserRequest } from "./v1/users/getUser.request.ts";

export interface IContextVariables extends ContextVariables {}

export function addRequest(server: ServerBuilder<IContextVariables>) {
    return addUserRequest(server);
}

const userRequest = [getUserRequest, postUserRequest];

function addUserRequest(server: ServerBuilder<IContextVariables>) {
    return server.group("/v1/crud", (app) => {
        userRequest.forEach(request => {
            request.useMiddleware(basicAuthMiddleware)
            .register(app);
        });
    });
}