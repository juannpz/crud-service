import { postUserCredentialsRequest } from "./v1/userCredentials/postUserCredentials.request.ts";
import { putUserCredentialsRequest } from "./v1/userCredentials/putUserCredentials.request.ts";
import { getUserCredentialsRequest } from "./v1/userCredentials/getUserCredentials.request.ts";
import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { postUserStatusRequest } from "./v1/userStatus/postUserStatus.ts";
import { buildBasicAuthMiddleware } from "./middleware/middleware.ts";
import { postUserRequest } from "./v1/user/postUser.request.ts";
import { getUserRequest } from "./v1/user/getUser.request.ts";
import { putUserRequest } from "./v1/user/putUser.request.ts";
import { ServiceConfig } from "../service.definition.ts";

export interface ExtendedContextVariables extends ContextVariables {
	userId: number;
}

export function addRequest(server: ServerBuilder<ExtendedContextVariables>, config: ServiceConfig) {
    addUserRequest(server, config);
    addUserCredentialsRequest(server, config);
	addUserStatusRequest(server, config);
}

const userRequest = [getUserRequest, postUserRequest, putUserRequest];
const userCredentialsRequest = [getUserCredentialsRequest, postUserCredentialsRequest, putUserCredentialsRequest];
const userStatusRequest = [postUserStatusRequest];

function addUserRequest(server: ServerBuilder<ExtendedContextVariables>, config: ServiceConfig) {
    server.group("/v1/crud", (app) => {
        userRequest.forEach(request => {
            request.useMiddleware(buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE))
            .register(app);
        });
    });
}

function addUserCredentialsRequest(server: ServerBuilder<ExtendedContextVariables>, config: ServiceConfig) {
    server.group("/v1/crud", (app) => {
        userCredentialsRequest.forEach(request => {
            request.useMiddleware(buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE))
                .register(app);
        });
    });
}

function addUserStatusRequest(server: ServerBuilder<ExtendedContextVariables>, config: ServiceConfig) {
	server.group("/v1/crud", (app) => {
        userStatusRequest.forEach(request => {
            request.useMiddleware(buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE))
                .register(app);
        });
    });
}