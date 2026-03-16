import {
    DatabaseTable,
    QuerySeparator,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { UserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { Router } from "@juannpz/deno-service-tools";
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
    .queryParam<"identity_id", number>("identity_id", {
        transform: (value) => parseInt(value as string),
    })
    .queryParam<"email", string>("email", {
        transform: (value) => (value as string).toLowerCase().trim(),
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, identity_id, email } = context.query;
        const userId = context.params.user_id || context.query.user_id;

        if (!userId && !identity_id && !email) {
            return context.c.json({
                message: "At least one query condition is required",
            }, 400);
        }

        const getUserCredentialsResult = await DatabaseManager.query<
            UserCredentials
        >({
            conditions: {
                user_id: userId,
                identity_id,
                email,
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.USER_CREDENTIALS,
            retrievalFormat: format,
            type: QueryType.SELECT,
            isTextSearch: false,
        });

        if (!getUserCredentialsResult.ok) {
            console.error(getUserCredentialsResult.message);

            return context.c.json({
                message: getUserCredentialsResult.message,
                error: getUserCredentialsResult.error,
            });
        }

        return context.c.json({
            message: `Found ${getUserCredentialsResult.value.rowCount} ${
                getUserCredentialsResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getUserCredentialsResult.value.rows,
        }, 200);
    });
