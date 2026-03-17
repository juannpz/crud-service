import {
    DatabaseTable,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { InventoryTransaction } from "../../../database/inventoryTransactions/inventoryTransactions.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { buildRequestResponse, Router, ValidationResult } from "@juannpz/deno-service-tools";

interface TransactionItem extends Record<string, unknown> {
    product_id: string;
    quantity: number;
    movement_type: string;
    user_id?: string;
    notes?: string;
}

interface Body extends Record<string, unknown> {
    transactions: TransactionItem[];
}

export const createInventoryTransactionRequest = Router.post<ExtendedContextVariables>(
    "/inventory-transaction",
)
    .describe("Inventory transaction creation (Ledger entry)")
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { transactions } = context.body;
        const { format } = context.query;

        const createTransactionResult = await DatabaseManager.query<InventoryTransaction>({
            conditions: {},
            table: DatabaseTable.INVENTORY_TRANSACTIONS,
            retrievalFormat: format,
            type: QueryType.INSERT,
            isParameterized: true,
            data: transactions,
        });

        if (!createTransactionResult.ok) {
            console.error(createTransactionResult.message);

            const response = buildRequestResponse(createTransactionResult);

            return context.c.json({ message: response.message, detail: response.detail }, response.code);
        }

        return context.c.json({
            message: `${createTransactionResult.value.rowCount} ${
                createTransactionResult.value.rowCount === 1 ? "entry" : "entries"
            } created successfully`,
            data: createTransactionResult.value.rows,
        }, 201);
    });

function validateBody(body: Body): ValidationResult {
    if (!Array.isArray(body.transactions) || body.transactions.length === 0) {
        return { valid: false, message: "Body must be a non-empty array of transactions" };
    }

    for (let i = 0; i < body.transactions.length; i++) {
        const item = body.transactions[i];
        if (!item.product_id) {
            return { valid: false, message: `Missing 'product_id' at index ${i}` };
        }
        if (item.quantity === undefined || item.quantity === null) {
            return { valid: false, message: `Missing 'quantity' at index ${i}` };
        }
        if (!item.movement_type) {
            return { valid: false, message: `Missing 'movement_type' at index ${i}` };
        }
    }

    return { valid: true };
}
