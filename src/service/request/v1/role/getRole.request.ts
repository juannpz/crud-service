import {
    DatabaseTable,
    QuerySeparator,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { User } from "../../../database/users/users.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

export const getRoleRequest = Router.get<ExtendedContextVariables>(
    "/role/:role_id?",
)
    .describe("Role retrieval")
    .pathParam<"role_id", number | undefined>("role_id", {
        transform: (value) => {
            if (!value) return undefined;
            const parsed = parseInt(value as string);
            return isNaN(parsed) ? undefined : parsed;
        },
    })
    .queryParam<"role_id", number | undefined>("role_id", {
        transform: (value) => {
            if (!value) return undefined;
            const parsed = parseInt(value as string);
            return isNaN(parsed) ? undefined : parsed;
        },
    })
    .queryParam<"name", string>("name")
    .queryParam<"format", RetrievalFormat>("format", { required: true })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, name } = context.query;

        const roleId = context.params.role_id ?? context.query.role_id;

        const getRoleResult = await DatabaseManager.query<User>({
            conditions: {
                role_id: roleId,
                name,
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.ROLES,
            retrievalFormat: format,
            type: QueryType.SELECT,
            isTextSearch: false,
        });

        if (!getRoleResult.ok) {
            console.error(getRoleResult.message);

            return context.c.json({ message: getRoleResult.message, error: getRoleResult.error });
        }

        return context.c.json({
            message: `Found ${getRoleResult.value.rowCount} ${
                getRoleResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getRoleResult.value.rows,
        }, 200);
    });
