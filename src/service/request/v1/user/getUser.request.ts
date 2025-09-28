import { QueryType, DatabaseTable, RetrievalFormat, QuerySeparator } from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUser } from "../../../database/users/users.definition.ts";
import { IContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

export const getUserRequest = Router.get<IContextVariables>("/user/:user_id?")
.describe("User retrieval")
.pathParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.queryParam<"format", RetrievalFormat>("format", { required: true })
.queryParam<"user_id", number>("user_id", { transform: (value) => parseInt(value as string) })
.queryParam<"user_status_id", number>("user_status_id", { transform: (value) => parseInt(value as string) })
.headerParam("Authorization")
.withVariables<IContextVariables>()
.handler(async (context) => {
    const { format } = context.query;
    const userId = context.params.user_id || context.query.user_id;
    const userStatusId = context.query.user_status_id;

    if (!userId && !userStatusId)
        return context.c.json({ message: "At least one query condition is required" }, 400);

    const getUserResult = await DatabaseManager.query<IUser>({
        conditions: {
            user_id: userId,
            user_status_id: context.query.user_status_id
        },
        separator: QuerySeparator.OR,
        table: DatabaseTable.USERS,
        retrievalFormat: format,
        type: QueryType.SELECT,
        isTextSearch: false
    });

    if (!getUserResult.ok){
        console.error(getUserResult.message);

        return context.c.json({ message: getUserResult.message });
    }

    return context.c.json({
        message: `Found ${getUserResult.value.rowCount} ${getUserResult.value.rowCount === 1 ? "entry" : "entrys"}`,
        data: getUserResult.value.rows
    }, 200);
});