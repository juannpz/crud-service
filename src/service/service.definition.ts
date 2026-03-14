import { getNumericDate, IGenerateKeyConfig, Payload } from "@juannpz/deno-service-tools";

export interface JWTPayload extends Payload {
    userId: number;
}

export const keyGenerationConfig: IGenerateKeyConfig = {
    algorithm: { name: "HMAC", hash: "SHA-256" },
    extractable: false,
    format: "raw",
    keyUsages: ["sign", "verify"],
};

export const JWT_PAYLOAD: JWTPayload = {
    userId: 1,
    aud: "test",
    exp: getNumericDate(60 * 60),
    iss: "test",
    sub: "test",
};

export interface ServiceConfig {
    dbConfig: DatabaseConfig;
    servicesEntrypoints: ServicesEntrypoints;
    authConfig: ServiceAuthConfig;
}

export interface DatabaseConfig {
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
}

export interface ServicesEntrypoints {
    SESSION_SERVICE: string;
}

export interface ServiceAuthConfig {
    SERVICE_AUTH_USER_ID: string;
    SERVICE_AUTH_ROLE: string;
    SERVICE_AUTH_PUBLIC_KEY: string;
}
