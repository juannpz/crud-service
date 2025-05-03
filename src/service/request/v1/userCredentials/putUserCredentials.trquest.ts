import { DatabaseTable, QueryType, RetrievalFormat } from "../../../database/database.definition.ts";
import { IUserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

interface IBody extends Record<string, unknown> {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number: Record<string, unknown>;
    metadata: Record<string, unknown>;
}

export const putUserCredentialsRequest = Router.put<IContextVariables>("/user-credentials/:user_id?")
.describe("User credentials update")
.pathParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.body<IBody>()
.validateBody(validateBody)
.queryParam<"format", RetrievalFormat>("format", { required: true })
.queryParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.headerParam("Authorization")
.withVariables<IContextVariables>()
.handler(async (context) => {
        const { email, first_name, last_name, password, phone_number, metadata } = context.body;

        const userId = context.params.user_id || context.query.user_id;

        const { format } = context.query;

        const updateUserCredentialsResult = await DatabaseManager.query<IUserCredentials>({
            conditions: {
                user_id: userId
            },
            table: DatabaseTable.USER_CREDENTIALS,
            retrievalFormat: format,
            type: QueryType.UPDATE,
            data: { email, first_name, last_name, password, phone_number, metadata }
        });

    if (!updateUserCredentialsResult.success) {
        console.error(updateUserCredentialsResult.message);

        return context.c.json({ message: updateUserCredentialsResult.message }, updateUserCredentialsResult.code);
    }

        return context.c.json({
            message: `${updateUserCredentialsResult.data.rowCount} ${updateUserCredentialsResult.data.rowCount === 1 ? "entry" : "entrys"} updated`,
            data: updateUserCredentialsResult.data.rows
        }, 200);
});

function validateBody(body: IBody) {
    if (Object.entries(body).length === 0)
        return false;

    return true;
}