import {
    DatabaseTable,
    QuerySeparator,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { User } from "../../../database/users/users.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router } from "@juannpz/deno-service-tools";

export const getUserRequest = Router.get<ExtendedContextVariables>(
    "/user/:user_id?",
)
    .describe("User retrieval")
    .pathParam<"user_id", string>("user_id")
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .queryParam<"user_id", string>("user_id")
    .queryParam<"user_status_id", string>("user_status_id")
    .queryParam<"role_id", string>("role_id")
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, role_id, user_status_id } = context.query;
        const userId = context.params.user_id || context.query.user_id;

        const getUserResult = await DatabaseManager.query<User>({
            conditions: {
                user_id: userId,
                user_status_id,
                role_id,
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.USERS,
            retrievalFormat: format,
            type: QueryType.SELECT,
            isTextSearch: false,
        });

        if (!getUserResult.ok) {
            console.error(getUserResult.message);

			const response = buildRequestResponse(getUserResult);

            return context.c.json({ message: response.message, detail: response.detail }, response.code);
        }

        return context.c.json({
            message: `Found ${getUserResult.value.rowCount} ${
                getUserResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getUserResult.value.rows,
        }, 200);
    });
