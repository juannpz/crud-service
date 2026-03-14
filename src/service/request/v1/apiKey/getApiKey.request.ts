import {
    DatabaseTable,
    QuerySeparator,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router } from "@juannpz/deno-service-tools";
import { ApiKey } from "../../../database/apiKeys/apiKeys.definition.ts";

export const getApiKeyRequest = Router.get<ExtendedContextVariables>(
    "/api-key/:api_key_id?",
)
    .describe("Api key retrieval")
    .pathParam<"api_key_id", number | undefined>("api_key_id", {
        transform: (value) => {
            if (!value) return undefined;
            const parsed = parseInt(value as string);
            return isNaN(parsed) ? undefined : parsed;
        },
    })
    .queryParam<"api_key_id", number | undefined>("api_key_id", {
        transform: (value) => {
            if (!value) return undefined;
            const parsed = parseInt(value as string);
            return isNaN(parsed) ? undefined : parsed;
        },
    })
    .queryParam<"user_id", string>("user_id")
    .queryParam<"format", RetrievalFormat>("format", { required: true })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, user_id } = context.query;

        const apiKeyId = context.params.api_key_id ?? context.query.api_key_id;

        const getApiKeyResult = await DatabaseManager.query<ApiKey>({
            conditions: {
                api_key_id: apiKeyId,
                user_id,
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.API_KEYS,
            retrievalFormat: format,
            type: QueryType.SELECT,
            isTextSearch: false,
        });

        if (!getApiKeyResult.ok) {
            console.error(getApiKeyResult.message);

            const response = buildRequestResponse(getApiKeyResult);

            return context.c.json(response, response.code);
        }

        return context.c.json({
            message: `Found ${getApiKeyResult.value.rowCount} ${
                getApiKeyResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getApiKeyResult.value.rows,
        }, 200);
    });
