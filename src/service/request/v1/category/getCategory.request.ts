import {
    DatabaseTable,
    QueryOperator,
    QuerySeparator,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { Product } from "../../../database/products/products.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router } from "@juannpz/deno-service-tools";
import { transformStringifiedBooleanToBoolean } from "../../request.util.ts";

export const getCategoryRequest = Router.get<ExtendedContextVariables>(
    "/category/:category_id?",
)
    .describe("Category retrieval and advanced filtering")
    .pathParam<"category_id", string>("category_id")
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .queryParam<"category_id", string>("category_id")
    .queryParam<"name", string>("name")
    .queryParam<"is_active", boolean | undefined>("is_active", {
        transform: (value) => transformStringifiedBooleanToBoolean(value),
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, is_active, name } = context.query;

        const categoryId = context.params.category_id || context.query.category_id;

        const conditions: Record<string, unknown> = {
            category_id: categoryId,
            is_active,
        };

        if (name) {
            conditions.name = {
                op: QueryOperator.ILIKE,
                val: `%${name}%`,
            };
        }

        const getProductResult = await DatabaseManager.query<Product>({
            type: QueryType.SELECT,
            table: DatabaseTable.CATEGORIES,
            isTextSearch: false,
            retrievalFormat: format,
            separator: QuerySeparator.AND,
            operator: QueryOperator.EQUALS,
            conditions,
        });

        if (!getProductResult.ok) {
            const response = buildRequestResponse(getProductResult);

            console.error(response.message);
            return context.c.json({ message: response.message, detail: response.detail }, 400);
        }

        return context.c.json({
            message: `Found ${getProductResult.value.rowCount} entries`,
            data: getProductResult.value.rows,
        }, 200);
    });
