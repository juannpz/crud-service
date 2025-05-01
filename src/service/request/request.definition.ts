import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { createUserRequest } from "./v1/user/createUser.request.ts";
import { basicAuthMiddleware } from "../middleware/middleware.ts";
import { getUserRequest } from "./v1/user/getUser.request.ts";
import { RetrievalFormat } from "../db/db.definition.ts";

export interface IContextVariables extends ContextVariables {
    format: RetrievalFormat;
}

export function addRequest(server: ServerBuilder<IContextVariables>) {
    addUserRequest(server);
}

const userRequest = [getUserRequest, createUserRequest];

function addUserRequest(server: ServerBuilder<IContextVariables>) {
    server.group("/v1/crud", (app) => {
        userRequest.forEach(request => {
            request.useMiddleware(basicAuthMiddleware);
            
            request.register(app)
        });
    });
}