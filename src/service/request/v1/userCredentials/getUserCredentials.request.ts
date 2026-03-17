import {
    DatabaseTable,
    QuerySeparator,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { UserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { buildRequestResponse, Router } from "@juannpz/deno-service-tools";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";

export const getUserCredentialsRequest = Router.get<ExtendedContextVariables>(
    "/user-credentials/:user_id?",
)
    .describe("User credentials retrieval")
    .pathParam<"user_id", string>("user_id")
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .queryParam<"user_id", string>("user_id")
    .queryParam<"user_credentials_id", string>("user_credentials_id")
    .queryParam<"email", string>("email", {
        transform: (value) => (value as string).toLowerCase().trim(),
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, user_credentials_id, email } = context.query;
        const userId = context.params.user_id || context.query.user_id;

        const getUserCredentialsResult = await DatabaseManager.query<
            UserCredentials
        >({
            type: QueryType.SELECT,
            table: DatabaseTable.USER_CREDENTIALS,
            isTextSearch: false,
            retrievalFormat: format,
            separator: QuerySeparator.OR,
            conditions: {
                user_id: userId,
                user_credentials_id,
                email,
            },
        });

        if (!getUserCredentialsResult.ok) {
            console.error(getUserCredentialsResult.message);

            const response = buildRequestResponse(getUserCredentialsResult);

            return context.c.json({
                message: response.message,
                detail: response.detail,
            }, response.code);
        }

        return context.c.json({
            message: `Found ${getUserCredentialsResult.value.rowCount} ${
                getUserCredentialsResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getUserCredentialsResult.value.rows,
        }, 200);
    });
