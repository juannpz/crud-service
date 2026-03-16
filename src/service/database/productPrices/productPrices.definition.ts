import { applyColumnConstraints, ColumnDefaultValue, createTable } from "@juannpz/extra-sql";
import { DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { SalesChannelsColumn } from "../salesChannels/salesChannels.definition.ts";
import { ProductsColumn } from "../products/products.definition.ts";

export interface ProductPrice {
    price_id: string;
    product_id: string;
    channel_id: string;
    price: number;
    updated_at: Date;
}

interface ProductPricesTable extends Record<string, PostgresDataType> {
    price_id: PostgresDataType.UUID;
    product_id: PostgresDataType.UUID;
    channel_id: PostgresDataType.UUID;
    price: PostgresDataType.DECIMAL;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

export enum ProductPricesColumn {
    PRICE_ID = "price_id",
    PRODUCT_ID = "product_id",
    CHANNEL_ID = "channel_id",
    PRICE = "price",
    UPDATED_AT = "updated_at",
}

const productPricesTable: ProductPricesTable = {
    price_id: PostgresDataType.UUID,
    product_id: PostgresDataType.UUID,
    channel_id: PostgresDataType.UUID,
    price: PostgresDataType.DECIMAL,
    updated_at: PostgresDataType.TIMESTAMPTZ,
};

export const CREATE_PRODUCT_PRICES_TABLE_QUERY = applyColumnConstraints<
    ProductPricesColumn,
    DatabaseTable.PRODUCTS | DatabaseTable.SALES_CHANNELS,
    ProductsColumn.PRODUCT_ID | SalesChannelsColumn.CHANNEL_ID
>(
    createTable(DatabaseTable.PRODUCT_PRICES, productPricesTable, {
        pk: ProductPricesColumn.PRICE_ID,
    }),
    {
        price_id: { notNull: true, default: ColumnDefaultValue.UUID },
        product_id: { notNull: true },
        channel_id: { notNull: true },
        price: { notNull: true, default: ColumnDefaultValue.ZERO },
        updated_at: { notNull: true, default: ColumnDefaultValue.NOW },
    },
    {
        product_id: {
            table: DatabaseTable.PRODUCTS,
            column: ProductsColumn.PRODUCT_ID,
            onDelete: "CASCADE",
        },
        channel_id: {
            table: DatabaseTable.SALES_CHANNELS,
            column: SalesChannelsColumn.CHANNEL_ID,
            onDelete: "CASCADE",
        },
    },
    [
        'CONSTRAINT "unique_product_channel" UNIQUE ("product_id", "channel_id")',
    ],
);
