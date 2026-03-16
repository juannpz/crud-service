import {
    DatabaseTable,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router, ValidationResult } from "@juannpz/deno-service-tools";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { ApiKey } from "../../../database/apiKeys/apiKeys.definition.ts";

interface Body extends Record<string, unknown> {
    user_id: string;
    public_key: string;
    private_key: string;
    description: string;
}

export const createApiKeyRequest = Router.post<ExtendedContextVariables>(
    "/api-key",
)
    .describe("Api key creation")
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { user_id, public_key, private_key, description } = context.body;
        const { format } = context.query;

        const createApiKeyResult = await DatabaseManager.query<ApiKey>({
            conditions: {},
            table: DatabaseTable.API_KEYS,
            retrievalFormat: format,
            type: QueryType.INSERT,
            isParameterized: true,
            data: [{ user_id, public_key, private_key, description }],
        });

        if (!createApiKeyResult.ok) {
            console.error(createApiKeyResult.message);

            const response = buildRequestResponse(createApiKeyResult);

            return context.c.json(response, response.code);
        }

        return context.c.json({
            data: createApiKeyResult.value.rows,
            message: `${createApiKeyResult.value.rowCount} ${
                createApiKeyResult.value.rowCount === 1 ? "entry" : "entrys"
            } created`,
        }, 200);
    });

function validateBody(body: Body): ValidationResult {
    if (!body.user_id) {
        return { valid: false, message: "Missing 'user_id' prop in body" };
    }

    if (!body.public_key) {
        return { valid: false, message: "Missing 'public_key' prop in body" };
    }

    if (!body.private_key) {
        return { valid: false, message: "Missing 'private_key' prop in body" };
    }

    if (!body.description) {
        return { valid: false, message: "Missing 'description' prop in body" };
    }

    return { valid: true };
}
