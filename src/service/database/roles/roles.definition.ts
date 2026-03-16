import { applyColumnConstraints, ColumnDefaultValue, createTable } from "@juannpz/extra-sql";
import { DatabaseTable, PostgresDataType } from "../database.definition.ts";

export interface Roles {
    role_id: number;
    name: string;
    description: string;
    metadata: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
}

interface RolesTable extends Record<string, PostgresDataType> {
    role_id: PostgresDataType.UUID;
    name: PostgresDataType.TEXT;
    description: PostgresDataType.TEXT;
    metadata: PostgresDataType.JSONB;
    created_at: PostgresDataType.TIMESTAMPTZ;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

enum RolesColumn {
    ROLE_ID = "role_id",
    NAME = "name",
    DESCRIPTION = "description",
    METADATA = "metadata",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at",
}

const rolesTable: RolesTable = {
    role_id: PostgresDataType.UUID,
    name: PostgresDataType.TEXT,
    description: PostgresDataType.TEXT,
    metadata: PostgresDataType.JSONB,
    created_at: PostgresDataType.TIMESTAMPTZ,
    updated_at: PostgresDataType.TIMESTAMPTZ,
};

export const CREATE_ROLES_TABLE_QUERY = applyColumnConstraints<
    RolesColumn
>(
    createTable(DatabaseTable.ROLES, rolesTable, {
        pk: RolesColumn.ROLE_ID,
    }),
    {
        role_id: { notNull: true, default: ColumnDefaultValue.UUID },
        name: { notNull: true, unique: true },
        description: { notNull: true },
        metadata: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
        created_at: { notNull: true, default: ColumnDefaultValue.NOW },
        updated_at: { notNull: true, default: ColumnDefaultValue.NOW },
    },
);
