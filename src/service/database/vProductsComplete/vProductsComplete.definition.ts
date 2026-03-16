import { buildView } from "@juannpz/extra-sql";
import { DatabaseTable } from "../database.definition.ts";
import { ProductPricesColumn } from "../productPrices/productPrices.definition.ts";
import { SalesChannelsColumn } from "../salesChannels/salesChannels.definition.ts";
import { ProductsColumn } from "../products/products.definition.ts";

export interface ProductPriceDetail {
    price_id: string;
    channel_id: string;
    channel_name: string;
    price: number;
}

export interface ProductWithPrices {
    product_id: string;
    barcode: string | null;
    name: string;
    category_id: string | null;
    current_stock: number;
    min_stock: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    prices: ProductPriceDetail[];
}

export enum VProductsCompleteColumn {
    PRODUCT_ID = "product_id",
    BARCODE = "barcode",
    NAME = "name",
    CATEGORY_ID = "category_id",
    CURRENT_STOCK = "current_stock",
    MIN_STOCK = "min_stock",
    IS_ACTIVE = "is_active",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at",
    PRICES = "prices",
}

export const CREATE_V_PRODUCTS_COMPLETE_VIEW_QUERY = buildView<VProductsCompleteColumn>({
    name: DatabaseTable.V_PRODUCTS_COMPLETE,
    columns: Object.values(VProductsCompleteColumn),
    from: { table: DatabaseTable.PRODUCTS, alias: "p" },
    select: [
        `p.${ProductsColumn.PRODUCT_ID}`,
        `p.${ProductsColumn.BARCODE}`,
        `p.${ProductsColumn.NAME}`,
        `p.${ProductsColumn.CATEGORY_ID}`,
        `p.${ProductsColumn.CURRENT_STOCK}`,
        `p.${ProductsColumn.MIN_STOCK}`,
        `p.${ProductsColumn.IS_ACTIVE}`,
        `p.${ProductsColumn.CREATED_AT}`,
        `p.${ProductsColumn.UPDATED_AT}`,
        `COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'price_id', pp.${ProductPricesColumn.PRICE_ID},
                    'channel_id', pp.${ProductPricesColumn.CHANNEL_ID},
                    'channel_name', sc.${SalesChannelsColumn.NAME},
                    'price', pp.${ProductPricesColumn.PRICE}
                )
            ) FILTER (WHERE pp.${ProductPricesColumn.PRICE_ID} IS NOT NULL), 
            '[]'::jsonb
        ) AS prices`,
    ],
    joins: [
        {
            type: "LEFT",
            table: DatabaseTable.PRODUCT_PRICES,
            alias: "pp",
            condition: `p.${ProductsColumn.PRODUCT_ID} = pp.${ProductPricesColumn.PRODUCT_ID}`,
        },
        {
            type: "LEFT",
            table: DatabaseTable.SALES_CHANNELS,
            alias: "sc",
            condition:
                `pp.${ProductPricesColumn.CHANNEL_ID} = sc.${SalesChannelsColumn.CHANNEL_ID}`,
        },
    ],
    groupBy: `p.${ProductsColumn.PRODUCT_ID}`,
});
