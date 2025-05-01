import { DatabaseTable, QueryType } from "../../../db/db.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUserTable } from "../../../db/user/user.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

interface IBody extends Record<string, unknown> {
    metadata: Record<string, unknown>;
}

export const createUserRequest = Router.post('/user')
    .describe('User creation')
    .body<IBody>()
    .headerParam('Authorization')
    .handler(async (context) => {
            const { metadata } = context.body;

            const createUserResult = await DatabaseManager.queryObject<IUserTable>({
                conditions: {},
                table: DatabaseTable.USER,
                type: QueryType.INSERT,
                isParameterized: true,
                data: [ { metadata } ]
            })
    
            if (!createUserResult.success)
                return context.c.json({ message: createUserResult.message }, createUserResult.code);
    
            return context.c.json({
                message: `${createUserResult.data.rowCount} ${createUserResult.data.rowCount === 1 ? "entry" : "entrys"} created`,
                data: createUserResult.data.rows
            }, 200);
        });