import { IJWTPayload, JWTPayload, keyGenerationConfig } from "./src/service/service.definition.ts";
import { Header, JWTManager, createResponseFromFetch } from "@juannpz/deno-service-tools";
import { buildAuthHeader } from "./src/service/request/request.util.ts";

JWTManager.init('test');

const JWTConfigHeaders: Header = {
    alg: 'HS256'
}

async function testRequest() {
    const generateJwtResult = await JWTManager.generate<IJWTPayload>(JWTConfigHeaders, JWTPayload, keyGenerationConfig);

    if (!generateJwtResult.success) {
        console.log(generateJwtResult.message);

        return;
    }

    console.log(generateJwtResult.data);

    const authHeader = buildAuthHeader(generateJwtResult.data);

    const response = await createResponseFromFetch<{ message: string, userId: number }>(
        fetch(`http://localhost:3000/v1/crud/user/1`, {
            headers: authHeader
        })
    );

    if (response.success) {
        console.log("Datos obtenidos:", response.data);
    } else {
        console.error(`Error: ${response.message}`);
    }
}

testRequest();