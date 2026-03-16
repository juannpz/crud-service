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

export const getUserStatusRequest = Router.get<ExtendedContextVariables>(
    "/user-status/:user_status_id?",
)
    .describe("User status retrieval")
    .pathParam<"user_status_id", number | undefined>("user_status_id", {
        transform: (value) => {
            if (!value) return undefined;
            const parsed = parseInt(value as string);
            return isNaN(parsed) ? undefined : parsed;
        },
    })
    .queryParam<"user_status_id", number | undefined>("user_status_id", {
        transform: (value) => {
            if (!value) return undefined;
            const parsed = parseInt(value as string);
            return isNaN(parsed) ? undefined : parsed;
        },
    })
    .queryParam<"name", string>("name")
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, name } = context.query;

        const userStatusId = context.params.user_status_id ?? context.query.user_status_id;

        const getUserStatusResult = await DatabaseManager.query<User>({
            conditions: {
                user_status_id: userStatusId,
                name,
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.USER_STATUS,
            retrievalFormat: format,
            type: QueryType.SELECT,
            isTextSearch: false,
        });

        if (!getUserStatusResult.ok) {
            console.error(getUserStatusResult.message);

            return context.c.json({
                message: getUserStatusResult.message,
                error: getUserStatusResult.error,
            });
        }

        return context.c.json({
            message: `Found ${getUserStatusResult.value.rowCount} ${
                getUserStatusResult.value.rowCount === 1 ? "entry" : "entrys"
            }`,
            data: getUserStatusResult.value.rows,
        }, 200);
    });
