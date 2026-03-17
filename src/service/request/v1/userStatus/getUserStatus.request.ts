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

export const getUserStatusRequest = Router.get<ExtendedContextVariables>(
    "/user-status/:user_status_id?",
)
    .describe("User status retrieval")
    .pathParam<"user_status_id", string>("user_status_id")
    .queryParam<"user_status_id", string>("user_status_id")
    .queryParam<"name", string>("name")
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, name } = context.query;

        const userStatusId = context.params.user_status_id ?? context.query.user_status_id;

        const conditions: Record<string, unknown> = {
            user_status_id: userStatusId,
        };

        if (name) {
            conditions.name = {
                op: QueryOperator.ILIKE,
                val: `%${name}%`,
            };
        }

        const getUserStatusResult = await DatabaseManager.query<User>({
            type: QueryType.SELECT,
            table: DatabaseTable.USER_STATUS,
            isTextSearch: false,
            retrievalFormat: format,
            separator: QuerySeparator.AND,
            operator: QueryOperator.EQUALS,
            conditions,
        });

        if (!getUserStatusResult.ok) {
            console.error(getUserStatusResult.message);

			const response = buildRequestResponse(getUserStatusResult);

            return context.c.json({
                message: response.message,
                detail: response.detail,
            }, response.code);
        }

        return context.c.json({
            message: `Found ${getUserStatusResult.value.rowCount} ${
                getUserStatusResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getUserStatusResult.value.rows,
        }, 200);
    });
