import { createUserCredentialsRequest } from "./v1/userCredentials/createUserCredentials.request.ts";
import { updateUserCredentialsRequest } from "./v1/userCredentials/updateUserCredentials.request.ts";
import { getUserCredentialsRequest } from "./v1/userCredentials/getUserCredentials.request.ts";
import { ContextVariables, ServerBuilder } from "@juannpz/deno-service-tools";
import { createUserStatusRequest } from "./v1/userStatus/createUserStatus.request.ts";
import { buildBasicAuthMiddleware } from "./middleware/middleware.ts";
import { createUserRequest } from "./v1/user/createUser.request.ts";
import { getUserRequest } from "./v1/user/getUser.request.ts";
import { updateUserRequest } from "./v1/user/updateUser.request.ts";
import { ServiceConfig } from "../service.definition.ts";
import { getRoleRequest } from "./v1/role/getRole.request.ts";
import { createRoleRequest } from "./v1/role/createRole.request.ts";
import { getApiKeyRequest } from "./v1/apiKey/getApiKey.request.ts";
import { createApiKeyRequest } from "./v1/apiKey/createApiKey.request.ts";
import { getProductRequest } from "./v1/product/getProduct.request.ts";
import { createProductRequest } from "./v1/product/createProductRequest.request.ts";
import { updateProductRequest } from "./v1/product/updateProduct.request.ts";
import { createInventoryTransactionRequest } from "./v1/inventoryTransaction/createInventoryTransaction.request.ts";
import { getUserStatusRequest } from "./v1/userStatus/getUserStatus.request.ts";
import { getCategoryRequest } from "./v1/category/getCategory.request.ts";
import { createCategoryRequest } from "./v1/category/createCategory.request.ts";

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
    addProductRequest(server, config);
    addInventoryTransactionRequest(server, config);
}

const userRequest = [getUserRequest, createUserRequest, updateUserRequest];
const userCredentialsRequest = [
    getUserCredentialsRequest,
    createUserCredentialsRequest,
    updateUserCredentialsRequest,
];
const userStatusRequest = [createUserStatusRequest, getUserStatusRequest];
const rolesRequest = [getRoleRequest, createRoleRequest];
const apiKeyRequest = [getApiKeyRequest, createApiKeyRequest];
const productRequest = [getProductRequest, createProductRequest, updateProductRequest];
const inventoryTransactionRequest = [createInventoryTransactionRequest];
const categoryRequest = [getCategoryRequest, createCategoryRequest];

function addUserRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        userRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            ).register(app);
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
            ).register(app);
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
            ).register(app);
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
            ).register(app);
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
            ).register(app);
        });
    });
}

function addProductRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        productRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            ).register(app);
        });
    });
}

function addInventoryTransactionRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        inventoryTransactionRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            ).register(app);
        });
    });
}

function addCategoryRequest(
    server: ServerBuilder<ExtendedContextVariables>,
    config: ServiceConfig,
) {
    server.group("/v1/crud", (app) => {
        categoryRequest.forEach((request) => {
            request.useMiddleware(
                buildBasicAuthMiddleware(config.servicesEntrypoints.SESSION_SERVICE),
            ).register(app);
        });
    });
}
