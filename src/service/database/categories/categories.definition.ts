import { applyColumnConstraints, ColumnDefaultValue, createTable } from "@juannpz/extra-sql";
import { DatabaseTable, PostgresDataType } from "../database.definition.ts";

export interface Category {
    category_id: string;
    name: string;
    description: string;
    is_active: boolean;
}

interface CategoriesTable extends Record<string, PostgresDataType> {
    category_id: PostgresDataType.UUID;
    name: PostgresDataType.TEXT;
    description: PostgresDataType.TEXT;
    is_active: PostgresDataType.BOOLEAN;
}

export enum CategoriesColumn {
    CATEGORY_ID = "category_id",
    NAME = "name",
    DESCRIPTION = "description",
    IS_ACTIVE = "is_active",
}

const categoriesTable: CategoriesTable = {
    category_id: PostgresDataType.UUID,
    name: PostgresDataType.TEXT,
    description: PostgresDataType.TEXT,
    is_active: PostgresDataType.BOOLEAN,
};

export const CREATE_CATEGORIES_TABLE_QUERY = applyColumnConstraints<
    CategoriesColumn
>(
    createTable(DatabaseTable.CATEGORIES, categoriesTable, {
        pk: CategoriesColumn.CATEGORY_ID,
    }),
    {
        category_id: { notNull: true, default: ColumnDefaultValue.UUID },
        name: { notNull: true, unique: true },
        description: { notNull: true },
        is_active: { notNull: true, default: ColumnDefaultValue.TRUE },
    },
);
