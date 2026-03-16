import {
    DatabaseTable,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { Category } from "../../../database/categories/categories.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router, ValidationResult } from "@juannpz/deno-service-tools";

interface Body extends Record<string, unknown> {
    name: string;
    description: string;
    is_active?: boolean;
}

export const createCategoryRequest = Router.post<ExtendedContextVariables>("/category")
    .describe("Bulk category creation")
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { name, description, is_active } = context.body;
        const { format } = context.query;

        const createCategoryResult = await DatabaseManager.query<Category>({
            conditions: {},
            table: DatabaseTable.CATEGORIES,
            retrievalFormat: format,
            type: QueryType.INSERT,
            isParameterized: true,
            data: [{ name, description, is_active }],
        });

        if (!createCategoryResult.ok) {
            console.error(createCategoryResult.message);

            const response = buildRequestResponse(createCategoryResult);

            return context.c.json(response, response.code);
        }

        return context.c.json({
            message: `${createCategoryResult.value.rowCount} ${
                createCategoryResult.value.rowCount === 1 ? "entry" : "entries"
            } created`,
            data: createCategoryResult.value.rows,
        }, 201); // 201 Created
    });

function validateBody(body: Body): ValidationResult {
    if (!body.name) return { valid: false, message: `Missing 'name' prop in body` };

    if (!body.description) return { valid: false, message: `Missing 'description' prop in body` };

    return { valid: true };
}
