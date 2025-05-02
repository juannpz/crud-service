import { IJWTPayload, JWTPayload, keyGenerationConfig } from "./src/service/service.definition.ts";
import { Header, JWTManager, createResponseFromFetch } from "@juannpz/deno-service-tools";
import { buildAuthHeaders } from "./src/service/request/request.util.ts";

JWTManager.init("test");

const JWTConfigHeaders: Header = {
    alg: "HS256"
}

async function buildConfig() {
    const generateJwtResult = await JWTManager.generate<IJWTPayload>(JWTConfigHeaders, JWTPayload, keyGenerationConfig);

    if (!generateJwtResult.success) {
        console.error(generateJwtResult.message);

        return;
    }

    return buildAuthHeaders(generateJwtResult.data);
}

async function getUserRequest() {
    const configHeaders = await buildConfig();

    if (!configHeaders)
        return;

    const response = await createResponseFromFetch<{ message: string, data: Record<string, unknown>[] }>(
        fetch(`http://localhost:3000/v1/crud/users?format=object&user_id=2`, {
            headers: configHeaders
        })
    );

    if (response.success)
        console.log("Response:", response.data);
    else 
        console.error(`Error: ${response.message}`);
}

async function getUserCredentialsRequest() {
    const configHeaders = await buildConfig();

    if (!configHeaders)
        return;

    const response = await createResponseFromFetch<{ message: string, data: Record<string, unknown>[] }>(
        fetch(`http://localhost:3000/v1/crud/user-credentials?format=object&user_id=1`, {
            headers: configHeaders
        })
    );

    if (response.success)
        console.log("Response:", response.data);
    else
        console.error(`Error: ${response.message}`);
}

async function createUserRequest() {
    const configHeaders = await buildConfig();

    if (!configHeaders)
        return;

    const response = await createResponseFromFetch<{ message: string, userId: number }>(
        fetch(`http://localhost:3000/v1/crud/users?format=object`, {
            headers: {
                ...configHeaders,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                metadata: {
                    name: "test"
                }
            })
        })
    );

    if (response.success)
        console.log("Response:", response.data);
    else
        console.error(`Error: ${response.message}`);
}

async function createUserCredentialsRequest() {
    const configHeaders = await buildConfig();

    if (!configHeaders)
        return;

    const response = await createResponseFromFetch<{ message: string, userId: number }>(
        fetch(`http://localhost:3000/v1/crud/user-credentials?format=object`, {
            headers: {
                ...configHeaders,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                metadata: {
                    name: "user1"
                },
                user_id: 1,
                email: "user1@user1.com",
                first_name: "user1",
                last_name: "user1",
                password: "user1",
                phone_number: {
                    updated_at: Date.now(),
                    country_indicator: "+54",
                    phone_number: "3546651160"
                }
            })
        })
    );

    if (response.success)
        console.log("Response:", response.data);
    else
        console.error(`Error: ${response.message}`);
}

// getUserRequest();
// createUserRequest();
getUserCredentialsRequest();
// createUserCredentialsRequest();