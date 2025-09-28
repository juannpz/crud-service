import { QueryType, DatabaseTable, RetrievalFormat, QuerySeparator } from "../../../database/database.definition.ts";
import { IUserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { buildRequestResponse, Router } from "@juannpz/deno-service-tools";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IContextVariables } from "../../request.definition.ts";

export const getUserCredentialsRequest = Router.get<IContextVariables>("/user-credentials/:user_id?")
.describe("User credentials retrieval")
.pathParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.queryParam<"format", RetrievalFormat>("format", { required: true })
.queryParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.queryParam<"identity_id", number>("identity_id", { transform: (value) => parseInt(value as string) })
.queryParam<"email", string>("email", { transform: (value) => (value as string).toLowerCase().trim() })
.headerParam("Authorization")
.withVariables<IContextVariables>()
.handler(async (context) => {
    const { format, identity_id, email } = context.query;
    const userId = context.params.user_id || context.query.user_id;

    if (!userId && !identity_id && !email)
        return context.c.json({ message: "At least one query condition is required" }, 400);

    const getUserCredentialsResult = await DatabaseManager.query<IUserCredentials>({
        conditions: {
            user_id: userId,
            identity_id,
            email
        },
        separator: QuerySeparator.OR,
        table: DatabaseTable.USER_CREDENTIALS,
        retrievalFormat: format,
        type: QueryType.SELECT,
        isTextSearch: false
    });

    if (!getUserCredentialsResult.ok) {
        console.error(getUserCredentialsResult.message);

        return context.c.json(buildRequestResponse(getUserCredentialsResult), 400);
    }

    return context.c.json({
		queryMessage: `Found ${getUserCredentialsResult.value.rowCount} ${getUserCredentialsResult.value.rowCount === 1 ? "entry" : "entrys"}`,
        ...buildRequestResponse(getUserCredentialsResult)
    }, 200);
});