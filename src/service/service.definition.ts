import { getNumericDate, IGenerateKeyConfig, Payload } from "@juannpz/deno-service-tools";

export interface IJWTPayload extends Payload {
    userId: number;
}

export const keyGenerationConfig: IGenerateKeyConfig = {
    algorithm: { name: 'HMAC', hash: 'SHA-256' },
    extractable: false,
    format: "raw",
    keyUsages: ['sign', 'verify']
};

export const JWTPayload: IJWTPayload = {
    userId: 1,
    aud: 'test',
    exp: getNumericDate(60 * 60),
    iss: 'test',
    sub: 'test'
};

export interface IServiceConfig {
    authConfig: IAuthConfig;
    serviceUrls: IServiceUrls;
    dbConfig: IDatabaseConfig;
}

export interface IAuthConfig {
    JWT_KEY: string;
}

export interface IServiceUrls {
    BROKER_SERVICE_URL: string;
}

export interface IDatabaseConfig {
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
}