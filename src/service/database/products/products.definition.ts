import {
    applyColumnConstraints,
    ColumnDefaultValue,
    createIndex,
    createTable,
} from "@juannpz/extra-sql";
import { DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { CategoriesColumn } from "../categories/categories.definition.ts";

export interface Product {
    product_id: string;
    barcode: string | null;
    name: string;
    category_id: string | null;
    current_stock: number;
    min_stock: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

interface ProductsTable extends Record<string, PostgresDataType> {
    product_id: PostgresDataType.UUID;
    barcode: PostgresDataType.TEXT;
    name: PostgresDataType.TEXT;
    category_id: PostgresDataType.UUID;
    current_stock: PostgresDataType.DECIMAL;
    min_stock: PostgresDataType.DECIMAL;
    is_active: PostgresDataType.BOOLEAN;
    created_at: PostgresDataType.TIMESTAMPTZ;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

export enum ProductsColumn {
    PRODUCT_ID = "product_id",
    BARCODE = "barcode",
    NAME = "name",
    CATEGORY_ID = "category_id",
    CURRENT_STOCK = "current_stock",
    MIN_STOCK = "min_stock",
    IS_ACTIVE = "is_active",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at",
}

const productsTable: ProductsTable = {
    product_id: PostgresDataType.UUID,
    barcode: PostgresDataType.TEXT,
    name: PostgresDataType.TEXT,
    category_id: PostgresDataType.UUID,
    current_stock: PostgresDataType.DECIMAL,
    min_stock: PostgresDataType.DECIMAL,
    is_active: PostgresDataType.BOOLEAN,
    created_at: PostgresDataType.TIMESTAMPTZ,
    updated_at: PostgresDataType.TIMESTAMPTZ,
};

export const CREATE_PRODUCTS_TABLE_QUERY = applyColumnConstraints<
    ProductsColumn,
    DatabaseTable.CATEGORIES,
    CategoriesColumn.CATEGORY_ID
>(
    createTable(DatabaseTable.PRODUCTS, productsTable, {
        pk: ProductsColumn.PRODUCT_ID,
    }),
    {
        product_id: { notNull: true, default: ColumnDefaultValue.UUID },
        barcode: { unique: true },
        name: { notNull: true },
        current_stock: { notNull: true, default: ColumnDefaultValue.ZERO },
        min_stock: { notNull: true, default: ColumnDefaultValue.ZERO },
        is_active: { notNull: true, default: ColumnDefaultValue.TRUE },
        created_at: { notNull: true, default: ColumnDefaultValue.NOW },
        updated_at: { notNull: true, default: ColumnDefaultValue.NOW },
    },
    {
        category_id: {
            table: DatabaseTable.CATEGORIES,
            column: CategoriesColumn.CATEGORY_ID,
            onDelete: "SET NULL",
        },
    },
);

export const CREATE_PRODUCT_BARCODE_INDEX_QUERY = createIndex(
    "idx_products_barcode",
    DatabaseTable.PRODUCTS,
    `"${ProductsColumn.BARCODE}"`,
);

export const CREATE_PRODUCT_NAME_INDEX_QUERY = createIndex(
    "idx_products_name",
    DatabaseTable.PRODUCTS,
    `"${ProductsColumn.NAME}"`,
);

export const CREATE_PRODUCT_CATEGORY_INDEX_QUERY = createIndex(
    "idx_products_category",
    DatabaseTable.PRODUCTS,
    `"${ProductsColumn.CATEGORY_ID}"`,
);
