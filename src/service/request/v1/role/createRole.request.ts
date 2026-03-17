import {
    DatabaseTable,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { UserStatus } from "../../../database/userStatus/userStatus.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router, ValidationResult } from "@juannpz/deno-service-tools";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";

interface Body extends Record<string, unknown> {
    name: number;
    description: string;
}

export const createRoleRequest = Router.post<ExtendedContextVariables>(
    "/role",
)
    .describe("Role creation")
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { name, description } = context.body;
        const { format } = context.query;

        const createRoleResult = await DatabaseManager.query<UserStatus>({
            conditions: {},
            table: DatabaseTable.ROLES,
            retrievalFormat: format,
            type: QueryType.INSERT,
            isParameterized: true,
            data: [{ name, description }],
        });

        if (!createRoleResult.ok) {
            console.error(createRoleResult.message);

			const response = buildRequestResponse(createRoleResult);

            return context.c.json({ message: response.message, detail: response.detail }, response.code);
        }

        return context.c.json({
            data: createRoleResult.value.rows,
            message: `${createRoleResult.value.rowCount} ${
                createRoleResult.value.rowCount === 1 ? "entry" : "entrys"
            } created`,
        }, 200);
    });

function validateBody(body: Body): ValidationResult {
    if (!body.name) {
        return { valid: false, message: "Missing 'name' prop in body" };
    }

    if (!body.description) {
        return { valid: false, message: "Missing 'description' prop in body" };
    }

    return { valid: true };
}
