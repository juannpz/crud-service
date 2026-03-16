import { applyColumnConstraints, ColumnDefaultValue, createTable } from "@juannpz/extra-sql";
import { DatabaseTable, PostgresDataType } from "../database.definition.ts";

export interface SalesChannel {
    channel_id: string;
    name: string;
    is_active: boolean;
}

interface SalesChannelsTable extends Record<string, PostgresDataType> {
    channel_id: PostgresDataType.UUID;
    name: PostgresDataType.TEXT;
    is_active: PostgresDataType.BOOLEAN;
}

export enum SalesChannelsColumn {
    CHANNEL_ID = "channel_id",
    NAME = "name",
    IS_ACTIVE = "is_active",
}

const salesChannelsTable: SalesChannelsTable = {
    channel_id: PostgresDataType.UUID,
    name: PostgresDataType.TEXT,
    is_active: PostgresDataType.BOOLEAN,
};

export const CREATE_SALES_CHANNELS_TABLE_QUERY = applyColumnConstraints<
    SalesChannelsColumn
>(
    createTable(DatabaseTable.SALES_CHANNELS, salesChannelsTable, {
        pk: SalesChannelsColumn.CHANNEL_ID,
    }),
    {
        channel_id: { notNull: true, default: ColumnDefaultValue.UUID },
        name: { notNull: true, unique: true },
        is_active: { notNull: true, default: ColumnDefaultValue.TRUE },
    },
);
