import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { basicAuthMiddleware } from "../middleware/middleware.ts";
import { postUserRequest } from "./v1/users/postUser.request.ts";
import { getUserRequest } from "./v1/users/getUser.request.ts";
import { getUserCredentialsRequest } from "./v1/userCredentials/getUserCredentials.request.ts";
import { postUserCredentialsRequest } from "./v1/userCredentials/postUserCredentials.request.ts";

export interface IContextVariables extends ContextVariables {}

export function addRequest(server: ServerBuilder<IContextVariables>) {
    addUserRequest(server);
    addUserCredentialsRequest(server);
}

const userRequest = [getUserRequest, postUserRequest];
const userCredentialsRequest = [getUserCredentialsRequest, postUserCredentialsRequest];

function addUserRequest(server: ServerBuilder<IContextVariables>) {
    server.group("/v1/crud", (app) => {
        userRequest.forEach(request => {
            request.useMiddleware(basicAuthMiddleware)
            .register(app);
        });
    });
}

function addUserCredentialsRequest(server: ServerBuilder<IContextVariables>) {
    server.group("/v1/crud", (app) => {
        userCredentialsRequest.forEach(request => {
            request.useMiddleware(basicAuthMiddleware)
                .register(app);
        });
    });
}