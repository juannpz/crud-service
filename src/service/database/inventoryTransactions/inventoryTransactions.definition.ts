import {
    applyColumnConstraints,
    ColumnDefaultValue,
    createFunctionAndTrigger,
    createTable,
} from "@juannpz/extra-sql";
import { DatabaseTable, NOTIFICATION_CHANNEL, PostgresDataType } from "../database.definition.ts";
import { UserColumn } from "../users/users.definition.ts";
import { ProductsColumn } from "../products/products.definition.ts";

export interface InventoryTransaction {
    transaction_id: string;
    product_id: string;
    user_id: string | null;
    quantity: number;
    movement_type: string;
    notes: string | null;
    created_at: Date;
}

interface InventoryTransactionsTable extends Record<string, PostgresDataType> {
    transaction_id: PostgresDataType.UUID;
    product_id: PostgresDataType.UUID;
    user_id: PostgresDataType.UUID;
    quantity: PostgresDataType.DECIMAL;
    movement_type: PostgresDataType.TEXT;
    notes: PostgresDataType.TEXT;
    created_at: PostgresDataType.TIMESTAMPTZ;
}

export enum InventoryTransactionsColumn {
    TRANSACTION_ID = "transaction_id",
    PRODUCT_ID = "product_id",
    USER_ID = "user_id",
    QUANTITY = "quantity",
    MOVEMENT_TYPE = "movement_type",
    NOTES = "notes",
    CREATED_AT = "created_at",
}

const inventoryTransactionsTable: InventoryTransactionsTable = {
    transaction_id: PostgresDataType.UUID,
    product_id: PostgresDataType.UUID,
    user_id: PostgresDataType.UUID,
    quantity: PostgresDataType.DECIMAL,
    movement_type: PostgresDataType.TEXT,
    notes: PostgresDataType.TEXT,
    created_at: PostgresDataType.TIMESTAMPTZ,
};

export const CREATE_INVENTORY_TRANSACTIONS_TABLE_QUERY = applyColumnConstraints<
    InventoryTransactionsColumn,
    DatabaseTable.PRODUCTS | DatabaseTable.USERS,
    ProductsColumn.PRODUCT_ID | UserColumn.USER_ID
>(
    createTable(DatabaseTable.INVENTORY_TRANSACTIONS, inventoryTransactionsTable, {
        pk: InventoryTransactionsColumn.TRANSACTION_ID,
    }),
    {
        transaction_id: { notNull: true, default: ColumnDefaultValue.UUID },
        product_id: { notNull: true },
        quantity: { notNull: true },
        movement_type: { notNull: true }, // 'SALE', 'PURCHASE', 'ADJUSTMENT'
        created_at: { notNull: true, default: ColumnDefaultValue.NOW },
    },
    {
        product_id: {
            table: DatabaseTable.PRODUCTS,
            column: ProductsColumn.PRODUCT_ID,
            onDelete: "RESTRICT",
        },
        user_id: {
            table: DatabaseTable.USERS,
            column: UserColumn.USER_ID,
            onDelete: "SET NULL",
        },
    },
);

export const CREATE_INVENTORY_TRANSACTIONS_NOTIFICATION_TRIGGER_QUERY = createFunctionAndTrigger<
    InventoryTransactionsColumn,
    DatabaseTable,
    DatabaseTable,
    ProductsColumn,
    InventoryTransactionsColumn,
    ProductsColumn
>(
    "notify_inventory_transaction_change",
    {
        // El ID principal que viajará en el payload
        topLevelIdentifier: InventoryTransactionsColumn.TRANSACTION_ID,

        // Qué datos de la transacción recién insertada queremos enviar al backend
        trackNewValues: {
            product_id: true,
            quantity: true,
            movement_type: true,
            user_id: true, // Útil si quieres loguear quién hizo el movimiento
        },

        // ¡La magia del JOIN en el Trigger!
        // Buscamos la info actual del producto en tiempo real
        joinTables: {
            products: {
                joinColumn: ProductsColumn.PRODUCT_ID,
                sourceColumn: InventoryTransactionsColumn.PRODUCT_ID,
                selectColumns: {
                    name: true,
                    current_stock: true,
                    min_stock: true,
                },
            },
        },

        // El canal por donde Deno va a escuchar esto
        channelName: NOTIFICATION_CHANNEL,

        triggers: {
            "inventory_transaction_insert_trigger": {
                tableName: DatabaseTable.INVENTORY_TRANSACTIONS,
                timing: "AFTER", // Se dispara DESPUÉS de que la transacción se guardó con éxito
                events: {
                    "INSERT": true, // Solo nos interesan las inserciones
                },
                forEach: "ROW",
            },
        },
    },
);
