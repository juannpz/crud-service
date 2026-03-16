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

export const getProductRequest = Router.get<ExtendedContextVariables>(
    "/product/:product_id?",
)
    .describe("Product retrieval and advanced filtering")
    .pathParam<"product_id", string>("product_id")
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .queryParam<"product_id", string>("product_id")
    .queryParam<"barcode", string>("barcode")
    .queryParam<"category_id", string>("category_id")
    .queryParam<"is_active", boolean | undefined>("is_active", {
        transform: (value) => transformStringifiedBooleanToBoolean(value),
    })
    .queryParam<"name", string>("name")
    .queryParam<"join", boolean | undefined>("join", {
        transform: (value) => transformStringifiedBooleanToBoolean(value),
        defaultValue: true,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { format, barcode, category_id, is_active, name, join } = context.query;

        const productId = context.params.product_id || context.query.product_id;

        const conditions: Record<string, unknown> = {
            product_id: productId,
            barcode,
            category_id,
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
            table: join ? DatabaseTable.V_PRODUCTS_COMPLETE : DatabaseTable.PRODUCTS,
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
