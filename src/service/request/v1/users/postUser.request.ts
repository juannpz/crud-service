import { DatabaseTable, QueryType, RetrievalFormat } from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUser } from "../../../database/users/users.definition.ts";
import { IContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

interface IBody extends Record<string, unknown> {
    user_status_id: number;
    metadata: Record<string, unknown>;
}

export const postUserRequest = Router.post<IContextVariables>("/users")
.describe("users insertion")
.body<IBody>()
.queryParam<"format", RetrievalFormat>("format", { required: true })
.headerParam("Authorization")
.withVariables<IContextVariables>()
.handler(async (context) => {
        const { user_status_id, metadata } = context.body;

        const { format } = context.query;

        const createUserResult = await DatabaseManager.query<IUser>({
            conditions: {},
            table: DatabaseTable.USERS,
            retrievalFormat: format,
            type: QueryType.INSERT,
            isParameterized: false,
            data: [ { user_status_id, metadata } ]
        });

        if (!createUserResult.success)
            return context.c.json({ message: createUserResult.message }, createUserResult.code);

        return context.c.json({
            message: `${createUserResult.data.rowCount} ${createUserResult.data.rowCount === 1 ? "entry" : "entrys"} created`,
            data: createUserResult.data.rows
        }, 200);
});