import { DatabaseTable, QueryType, RetrievalFormat } from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUser } from "../../../database/users/users.definition.ts";
import { IContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

interface IBody extends Record<string, unknown> {
    user_status_id: number;
    metadata: Record<string, unknown>;
}

export const putUserRequest = Router.put<IContextVariables>("/user/:user_id?")
.describe("User update")
.pathParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.body<IBody>()
.validateBody(validateBody)
.queryParam<"format", RetrievalFormat>("format", { required: true })
.queryParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.headerParam("Authorization")
.withVariables<IContextVariables>()
.handler(async (context) => {
        const { user_status_id, metadata } = context.body;

        const userId = context.params.user_id || context.query.user_id;

        const { format } = context.query;

        const updateUserResult = await DatabaseManager.query<IUser>({
            conditions: {
                user_id: userId
            },
            table: DatabaseTable.USERS,
            retrievalFormat: format,
            type: QueryType.UPDATE,
            data: { user_status_id, metadata }
        });

    if (!updateUserResult.success) {
        console.error(updateUserResult.message);

        return context.c.json({ message: updateUserResult.message }, updateUserResult.code);
    }

        return context.c.json({
            message: `${updateUserResult.data.rowCount} ${updateUserResult.data.rowCount === 1 ? "entry" : "entrys"} updated`,
            data: updateUserResult.data.rows
        }, 200);
});

function validateBody(body: IBody) {
    if(Object.entries(body).length === 0)
        return false;

    return true;
}