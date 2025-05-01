import { Router } from "@juannpz/deno-service-tools";
import { DatabaseTable, QueryType } from "../../../db/db.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUserTable } from "../../../db/user/user.definition.ts";

interface IBody extends Record<string, unknown> {
    metadata: Record<string, unknown>;
}

export const test1Request = Router.post('/user')
    .describe('User creation')
    .body<IBody>()
    .headerParam('Authorization')
    .handler(async (context) => {
            const { id } = context.params;
    
            const getUserResult = await DatabaseManager.queryObject<IUserTable>({
                conditions: {
                    user_id: id
                },
                table: DatabaseTable.USER,
                type: QueryType.SELECT,
                isTextSearch: false
            })
    
            if (!getUserResult.success)
                return context.c.json({ message: getUserResult.message }, getUserResult.code);
    
            return context.c.json({ message: `Showing ${ getUserResult.data.rowCount } results`, data: getUserResult.data.rows }, 200);
        });