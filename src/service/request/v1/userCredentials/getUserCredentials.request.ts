import { QueryType, DatabaseTable, RetrievalFormat, QuerySeparator } from "../../../database/database.definition.ts";
import { IUserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

export const getUserCredentialsRequest = Router.get<IContextVariables>("/user-credentials/:user_id?")
    .describe("User credentials retrieval")
    .pathParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
    .queryParam<"format", RetrievalFormat>("format", { required: true })
    .queryParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
    .queryParam<"identity_id", number>("identity_id", { transform: (value) => parseInt(value as string) })
    .headerParam("Authorization")
    .withVariables<IContextVariables>()
    .handler(async (context) => {
        const { format } = context.query;

        const userId = context.params.user_id || context.query.user_id;
        const identityId = context.query.identity_id;

        const getUserCredentialsResult = await DatabaseManager.query<IUserCredentials>({
            conditions: {
                user_id: userId,
                identity_id: identityId
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.USER_CREDENTIALS,
            retrievalFormat: format,
            type: QueryType.SELECT,
            isTextSearch: false
        });

        if (!getUserCredentialsResult.success) {
            console.error(getUserCredentialsResult.message);

            return context.c.json({ message: getUserCredentialsResult.message }, getUserCredentialsResult.code);
        }

        return context.c.json({
            message: `Found ${getUserCredentialsResult.data.rowCount} ${getUserCredentialsResult.data.rowCount === 1 ? "entry" : "entrys"}`,
            data: getUserCredentialsResult.data.rows
        }, 200);
    });