import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { RetrievalFormat } from "../database/database.definition.ts";
import { postUserRequest } from "./v1/users/postUser.request.ts";
import { basicAuthMiddleware } from "../middleware/middleware.ts";
import { getUserRequest } from "./v1/users/getUser.request.ts";

export interface IContextVariables extends ContextVariables {
    format: RetrievalFormat;
}

export function addRequest(server: ServerBuilder<IContextVariables>) {
    addUserRequest(server);
}

const userRequest = [getUserRequest, postUserRequest];

function addUserRequest(server: ServerBuilder<IContextVariables>) {
    server.group("/v1/crud", (app) => {
        userRequest.forEach(request => {
            request.useMiddleware(basicAuthMiddleware);
            
            request.register(app)
        });
    });
}