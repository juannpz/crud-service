import {
    DatabaseTable,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { User } from "../../../database/users/users.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router, ValidationResult } from "@juannpz/deno-service-tools";

interface Body extends Record<string, unknown> {
    user_status_id: string;
    role_id: string;
    metadata: Record<string, unknown>;
}

export const createUserRequest = Router.post<ExtendedContextVariables>("/user")
    .describe("User creation")
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { user_status_id, role_id, metadata } = context.body;
        const { format } = context.query;

        const createUserResult = await DatabaseManager.query<User>({
            conditions: {},
            table: DatabaseTable.USERS,
            retrievalFormat: format,
            type: QueryType.INSERT,
            isParameterized: true,
            data: [{ user_status_id, role_id, metadata }],
        });

        if (!createUserResult.ok) {
            console.error(createUserResult.message);

            const response = buildRequestResponse(createUserResult);

            return context.c.json(response, response.code);
        }

        return context.c.json({
            message: `${createUserResult.value.rowCount} ${
                createUserResult.value.rowCount === 1 ? "entry" : "entrys"
            } created`,
            data: createUserResult.value.rows,
        }, 200);
    });

function validateBody(body: Body): ValidationResult {
    if (!body.user_status_id) {
        return { valid: false, message: "Missing 'user_status_id' prop in body" };
    }

    if (!body.metadata) {
        return { valid: false, message: "Missing 'metadata' prop in body" };
    }

    return { valid: true };
}
