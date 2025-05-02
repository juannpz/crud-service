import { QueryType, DatabaseTable, RetrievalFormat } from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUser } from "../../../database/users/users.definition.ts";
import { IContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

export const getUserRequest = Router.get<IContextVariables>("/users/:user_id?")
.describe("User retrieval")
.pathParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.queryParam<"format", RetrievalFormat>("format", { required: true })
.queryParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.headerParam("Authorization")
.withVariables<IContextVariables>()
.handler(async (context) => {
    const { format } = context.query;

    const userId = context.params.user_id || context.query.user_id;

    if (!userId)
        return context.c.json({ message: "Missing user ID" }, 400);

    const getUserResult = await DatabaseManager.query<IUser>({
        conditions: {
            user_id: userId
        },
        table: DatabaseTable.USERS,
        retrievalFormat: format,
        type: QueryType.SELECT,
        isTextSearch: false
    });

    if (!getUserResult.success)
        return context.c.json({ message: getUserResult.message }, getUserResult.code);

    return context.c.json({
        message: `Found ${getUserResult.data.rowCount} ${getUserResult.data.rowCount === 1 ? "row" : "rows"}`,
        data: getUserResult.data.rows
    }, 200);
});