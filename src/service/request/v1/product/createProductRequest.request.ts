import {
    DatabaseTable,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { Product } from "../../../database/products/products.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router, ValidationResult } from "@juannpz/deno-service-tools";

interface ProdutItem extends Record<string, unknown> {
    name: string;
    barcode?: string;
    category_id?: string;
    current_stock?: number;
    min_stock?: number;
    is_active?: boolean;
}

interface Body extends Record<string, unknown> {
    products: ProdutItem[];
}

export const createProductRequest = Router.post<ExtendedContextVariables>("/product")
    .describe("Product creation")
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { products } = context.body;
        const { format } = context.query;

        const createProductResult = await DatabaseManager.query<Product>({
            conditions: {},
            table: DatabaseTable.PRODUCTS,
            retrievalFormat: format,
            type: QueryType.INSERT,
            isParameterized: true,
            data: products,
        });

        if (!createProductResult.ok) {
            console.error(createProductResult.message);

            const response = buildRequestResponse(createProductResult);

            return context.c.json(response, response.code);
        }

        return context.c.json({
            message: `${createProductResult.value.rowCount} ${
                createProductResult.value.rowCount === 1 ? "entry" : "entries"
            } created`,
            data: createProductResult.value.rows,
        }, 200);
    });

function validateBody(body: Body): ValidationResult {
    if (!Array.isArray(body.products) || body.products.length === 0) {
        return { valid: false, message: "Body must be a non-empty array of products" };
    }

    for (let i = 0; i < body.products.length; i++) {
        const item = body.products[i];
        if (!item.name) return { valid: false, message: `Missing 'name' at index ${i}` };
    }

    return { valid: true };
}
