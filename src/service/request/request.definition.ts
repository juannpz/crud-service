import { postUserCredentialsRequest } from "./v1/userCredentials/postUserCredentials.request.ts";
import { putUserCredentialsRequest } from "./v1/userCredentials/putUserCredentials.trquest.ts";
import { getUserCredentialsRequest } from "./v1/userCredentials/getUserCredentials.request.ts";
import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { basicAuthMiddleware } from "../middleware/middleware.ts";
import { postUserRequest } from "./v1/user/postUser.request.ts";
import { getUserRequest } from "./v1/user/getUser.request.ts";
import { putUserRequest } from "./v1/user/putUser.request.ts";

export interface IContextVariables extends ContextVariables {}

export function addRequest(server: ServerBuilder<IContextVariables>) {
    addUserRequest(server);
    addUserCredentialsRequest(server);
}

const userRequest = [getUserRequest, postUserRequest, putUserRequest];
const userCredentialsRequest = [getUserCredentialsRequest, postUserCredentialsRequest, putUserCredentialsRequest];

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