import {
    DatabaseTable,
    QueryOperator,
    QuerySeparator,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { User } from "../../../database/users/users.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router } from "@juannpz/deno-service-tools";

export const getRoleRequest = Router.get<ExtendedContextVariables>(
    "/role/:role_id?",
)
    .describe("Role retrieval")
    .pathParam<"role_id", string>("role_id")
    .queryParam<"role_id", string>("role_id")
    .queryParam<"name", string>("name")
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, name } = context.query;

        const roleId = context.params.role_id ?? context.query.role_id;

        const conditions: Record<string, unknown> = {
            role_id: roleId,
        };

        if (name) {
            conditions.name = {
                op: QueryOperator.ILIKE,
                val: `%${name}%`,
            };
        }

        const getRoleResult = await DatabaseManager.query<User>({
            type: QueryType.SELECT,
            table: DatabaseTable.ROLES,
            isTextSearch: false,
            retrievalFormat: format,
            separator: QuerySeparator.AND,
            operator: QueryOperator.EQUALS,
            conditions,
        });

        if (!getRoleResult.ok) {
            console.error(getRoleResult.error);
            const response = buildRequestResponse(getRoleResult);

            return context.c.json(
                { message: response.message, detail: response.detail },
                response.code,
            );
        }

        return context.c.json({
            message: `Found ${getRoleResult.value.rowCount} ${
                getRoleResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getRoleResult.value.rows,
        }, 200);
    });
