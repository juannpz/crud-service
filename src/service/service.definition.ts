import { getNumericDate, IGenerateKeyConfig, Payload } from "@juannpz/deno-service-tools";

export interface JWTPayload extends Payload {
    userId: number;
}

export const keyGenerationConfig: IGenerateKeyConfig = {
    algorithm: { name: "HMAC", hash: "SHA-256" },
    extractable: false,
    format: "raw",
    keyUsages: ["sign", "verify"]
};

export const JWT_PAYLOAD: JWTPayload = {
    userId: 1,
    aud: "test",
    exp: getNumericDate(60 * 60),
    iss: "test",
    sub: "test"
};

export interface ServiceConfig {
    authConfig: AuthConfig;
    serviceUrls: ServiceUrls;
    dbConfig: DatabaseConfig;
}

export interface AuthConfig {
    JWT_KEY: string;
}

export interface ServiceUrls {
    SESSION_SERVICE_URL: string;
}

export interface DatabaseConfig {
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
}