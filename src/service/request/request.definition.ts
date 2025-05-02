import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { createUserRequest } from "./v1/users/createUser.request.ts";
import { basicAuthMiddleware } from "../middleware/middleware.ts";
import { RetrievalFormat } from "../database/database.definition.ts";
import { getUserRequest } from "./v1/users/getUser.request.ts";

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