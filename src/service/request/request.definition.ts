import { createUserCredentialsRequest } from "./v1/userCredentials/createUserCredentials.request.ts";
import { updateUserCredentialsRequest } from "./v1/userCredentials/updateUserCredentials.request.ts";
import { getUserCredentialsRequest } from "./v1/userCredentials/getUserCredentials.request.ts";
import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { createUserStatusRequest } from "./v1/userStatus/createUserStatus.ts";
import { buildBasicAuthMiddleware } from "./middleware/middleware.ts";
import { createUserRequest } from "./v1/user/createUser.request.ts";
import { getUserRequest } from "./v1/user/getUser.request.ts";
import { updateUserRequest } from "./v1/user/updateUser.request.ts";
import { ServiceConfig } from "../service.definition.ts";
import { getRoleRequest } from "./v1/role/getRole.request.ts";
import { createRoleRequest } from "./v1/role/createRole.request.ts";
import { getApiKeyRequest } from "./v1/apiKey/getApiKey.request.ts";
import { createApiKeyRequest } from "./v1/apiKey/createApiKey.request.ts";

export interface ExtendedContextVariables extends ContextVariables {
    userId: number;
}

export function addRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    addUserRequest(server, config);
    addUserCredentialsRequest(server, config);
    addUserStatusRequest(server, config);
    addRolesRequest(server, config);
	addApiKeyRequest(server, config);
}

const userRequest = [getUserRequest, createUserRequest, updateUserRequest];
const userCredentialsRequest = [
    getUserCredentialsRequest,
    createUserCredentialsRequest,
    updateUserCredentialsRequest,
];
const userStatusRequest = [createUserStatusRequest];
const rolesRequest = [getRoleRequest, createRoleRequest];
const apiKeyRequest = [getApiKeyRequest, createApiKeyRequest]

function addUserRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        userRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            )
                .register(app);
        });
    });
}

function addUserCredentialsRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        userCredentialsRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            )
                .register(app);
        });
    });
}

function addUserStatusRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        userStatusRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            )
                .register(app);
        });
    });
}

function addRolesRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        rolesRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            )
                .register(app);
        });
    });
}

function addApiKeyRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        apiKeyRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            )
                .register(app);
        });
    });
}
