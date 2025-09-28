import { DatabaseTable, QuerySeparator, QueryType, RetrievalFormat } from "../../../database/database.definition.ts";
import { UserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

interface IBody extends Record<string, unknown> {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number: Record<string, unknown>;
    metadata: Record<string, unknown>;
}

export const putUserCredentialsRequest = Router.put<ExtendedContextVariables>("/user-credentials/:user_id?")
.describe("User credentials update")
.pathParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.body<IBody>()
.validateBody(validateBody)
.queryParam<"format", RetrievalFormat>("format", { required: true })
.queryParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.queryParam<"identity_id", number>("identity_id", { transform: (value) => parseInt(value as string) })
.headerParam("Authorization")
.withVariables<ExtendedContextVariables>()
.handler(async (context) => {
        const { email, first_name, last_name, password, phone_number, metadata } = context.body;
        const userId = context.params.user_id || context.query.user_id;
        const { format, identity_id } = context.query;

        if (!userId && !identity_id)
            return context.c.json({ message: "User ID or identity ID is required" }, 400);

        const updateUserCredentialsResult = await DatabaseManager.query<UserCredentials>({
            conditions: {
                user_id: userId,
                identity_id
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.USER_CREDENTIALS,
            retrievalFormat: format,
            type: QueryType.UPDATE,
            data: { email, first_name, last_name, password, phone_number, metadata }
        });

    if (!updateUserCredentialsResult.ok) {
        console.error(updateUserCredentialsResult.message);

        return context.c.json({ message: updateUserCredentialsResult.message });
    }

        return context.c.json({
            message: `${updateUserCredentialsResult.value.rowCount} ${updateUserCredentialsResult.value.rowCount === 1 ? "entry" : "entrys"} updated`,
            data: updateUserCredentialsResult.value.rows
        }, 200);
});

function validateBody(body: IBody) {
    if (Object.entries(body).length === 0)
        return false;

    return true;
}