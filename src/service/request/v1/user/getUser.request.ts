import { QueryType, DatabaseTable } from "../../../db/db.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUserTable } from "../../../db/user/user.definition.ts";
import { IContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";
import { getContextVariables } from "../../request.util.ts";

export const getUserRequest = Router.get<IContextVariables>("/user/:id")
    .describe("User retrieval")
    .pathParam("id", { validator: () => {
        return true;
    }})
    .headerParam("Authorization")
    .withVariables<IContextVariables>()
    .handler(async (context) => {
        const { id } = context.params;

        const { format } = getContextVariables(context.c);

        const getUserResult = await DatabaseManager.query<IUserTable<{ metadata: Record<string, unknown> }>>({
            conditions: {
                user_id: id
            },
            table: DatabaseTable.USER,
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