import { DatabaseTable, QueryType } from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUser } from "../../../database/users/users.definition.ts";
import { IContextVariables } from "../../request.definition.ts";
import { getContextVariables } from "../../request.util.ts";
import { Router } from "@juannpz/deno-service-tools";

interface IBody extends Record<string, unknown> {
    metadata: Record<string, unknown>;
}

export const createUserRequest = Router.post<IContextVariables>("/users")
    .describe("User creation")
    .body<IBody>()
    .queryParam("format", { required: true })
    .headerParam("Authorization")
    .withVariables<IContextVariables>()
    .handler(async (context) => {
            const metadata = JSON.stringify(context.body.metadata);

            const { format } = getContextVariables(context.c);

            const createUserResult = await DatabaseManager.query<IUser>({
                conditions: {},
                table: DatabaseTable.USERS,
                retrievalFormat: format,
                type: QueryType.INSERT,
                isParameterized: false,
                data: [ { metadata } ]
            });
    
            if (!createUserResult.success)
                return context.c.json({ message: createUserResult.message }, createUserResult.code);
    
            return context.c.json({
                message: `${createUserResult.data.rowCount} ${createUserResult.data.rowCount === 1 ? "entry" : "entrys"} created`,
                data: createUserResult.data.rows
            }, 200);
        });