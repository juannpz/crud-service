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
import { buildRequestResponse, Router, ValidationResult } from "@juannpz/deno-service-tools";

interface Body extends Record<string, unknown> {
    name?: string;
    barcode?: string;
    category_id?: string;
    current_stock?: number;
    min_stock?: number;
    is_active?: boolean;
}

export const updateProductRequest = Router.patch<ExtendedContextVariables>(
    "/product/:product_id",
)
    .describe("Product update")
    .pathParam<"product_id", string>("product_id", { required: true })
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { name, barcode, category_id, current_stock, min_stock, is_active } = context.body;
        const productId = context.params.product_id;
        const { format } = context.query;

        const updateProductResult = await DatabaseManager.query<Product>({
            type: QueryType.UPDATE,
            table: DatabaseTable.PRODUCTS,
            retrievalFormat: format,
            conditions: {
                product_id: productId,
            },
            separator: QuerySeparator.AND,
            operator: QueryOperator.EQUALS,
            data: {
                name,
                barcode,
                category_id,
                current_stock,
                min_stock,
                is_active,
            },
        });

        if (!updateProductResult.ok) {
            const response = buildRequestResponse(updateProductResult);
            response.code = 400;

            console.error(response.message);
            return context.c.json(response, response.code);
        }

        return context.c.json({
            message: "Product updated successfully",
            data: updateProductResult.value.rows[0],
        }, 200);
    });

function validateBody(body: Body): ValidationResult {
    if (Object.keys(body).length === 0) {
        return { valid: false, message: "Body cannot be empty for an update" };
    }

    return { valid: true };
}
