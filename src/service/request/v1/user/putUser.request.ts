import { DatabaseTable, QueryType, RetrievalFormat } from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { User } from "../../../database/users/users.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

interface IBody extends Record<string, unknown> {
    user_status_id: number;
    metadata: Record<string, unknown>;
}

export const putUserRequest = Router.put<ExtendedContextVariables>("/user/:user_id?")
.describe("User update")
.pathParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.body<IBody>()
.validateBody(validateBody)
.queryParam<"format", RetrievalFormat>("format", { required: true })
.queryParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.headerParam("Authorization")
.withVariables<ExtendedContextVariables>()
.handler(async (context) => {
        const { user_status_id, metadata } = context.body;
        const userId = context.params.user_id || context.query.user_id;
        const { format } = context.query;

        if (!userId)
            return context.c.json({ message: "User ID is required" }, 400);

        const updateUserResult = await DatabaseManager.query<User>({
            conditions: {
                user_id: userId
            },
            table: DatabaseTable.USERS,
            retrievalFormat: format,
            type: QueryType.UPDATE,
            data: { user_status_id, metadata }
        });

    if (!updateUserResult.ok) {
        console.error(updateUserResult.message);

        return context.c.json({ message: updateUserResult.message });
    }

        return context.c.json({
            message: `${updateUserResult.value.rowCount} ${updateUserResult.value.rowCount === 1 ? "entry" : "entrys"} updated`,
            data: updateUserResult.value.rows
        }, 200);
});

function validateBody(body: IBody) {
    if(Object.entries(body).length === 0)
        return false;

    return true;
}