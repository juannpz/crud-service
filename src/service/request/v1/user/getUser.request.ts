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

export const getUserRequest = Router.get<ExtendedContextVariables>(
    "/user/:user_id?",
)
    .describe("User retrieval")
    .pathParam<"user_id", string>("user_id")
    .queryParam<"format", RetrievalFormat>("format", { required: true })
    .queryParam<"user_id", string>("user_id")
    .queryParam<"user_status_id", number | undefined>("user_status_id", {
        transform: (value) => {
            if (!value) return undefined;
            const parsed = parseInt(value as string);
            return isNaN(parsed) ? undefined : parsed;
        },
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format } = context.query;
        const userId = context.params.user_id || context.query.user_id;
        const userStatusId = context.query.user_status_id;

        const getUserResult = await DatabaseManager.query<User>({
            conditions: {
                user_id: userId,
                user_status_id: userStatusId,
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.USERS,
            retrievalFormat: format,
            type: QueryType.SELECT,
            isTextSearch: false,
        });

        if (!getUserResult.ok) {
            console.error(getUserResult.message);

            return context.c.json({ message: getUserResult.message, error: getUserResult.error });
        }

        return context.c.json({
            message: `Found ${getUserResult.value.rowCount} ${
                getUserResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getUserResult.value.rows,
        }, 200);
    });
