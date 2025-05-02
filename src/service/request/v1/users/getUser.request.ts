import { QueryType, DatabaseTable } from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUser } from "../../../database/users/users.definition.ts";
import { IContextVariables } from "../../request.definition.ts";
import { getContextVariables } from "../../request.util.ts";
import { Router } from "@juannpz/deno-service-tools";

export const getUserRequest = Router.get<IContextVariables>("/users/:id")
    .describe("User retrieval")
    .pathParam("id", { validator: () => {
        return true;
    }})
    .headerParam("Authorization")
    .withVariables<IContextVariables>()
    .handler(async (context) => {
        const { id } = context.params;

        const { format } = getContextVariables(context.c);

        const getUserResult = await DatabaseManager.query<IUser>({
            conditions: {
                user_id: id
            },
            table: DatabaseTable.USERS,
            retrievalFormat: format,
            type: QueryType.SELECT,
            isTextSearch: false
        })

        if (!getUserResult.success)
            return context.c.json({ message: getUserResult.message }, getUserResult.code);

        return context.c.json({
            message: `Found ${getUserResult.data.rowCount} ${getUserResult.data.rowCount === 1 ? "row" : "rows"}`,
            data: getUserResult.data.rows
        }, 200);
    });