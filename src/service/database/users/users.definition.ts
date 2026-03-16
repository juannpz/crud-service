import { applyColumnConstraints, ColumnDefaultValue, createTable } from "@juannpz/extra-sql";
import { DatabaseTable, PostgresDataType } from "../database.definition.ts";

export interface User {
    user_id: string;
    user_status_id: string | null;
    role_id: string;
    metadata: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
}

interface UsersTable extends Record<string, PostgresDataType> {
    user_id: PostgresDataType.UUID;
    user_status_id: PostgresDataType.UUID;
    role_id: PostgresDataType.UUID;
    metadata: PostgresDataType.JSONB;
    created_at: PostgresDataType.TIMESTAMPTZ;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

export enum UserColumn {
    USER_ID = "user_id",
    USER_STATUS_ID = "user_status_id",
    ROLE_ID = "role_id",
    METADATA = "metadata",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at",
}

const usersTable: UsersTable = {
    user_id: PostgresDataType.UUID,
    user_status_id: PostgresDataType.UUID,
    role_id: PostgresDataType.UUID,
    metadata: PostgresDataType.JSONB,
    created_at: PostgresDataType.TIMESTAMPTZ,
    updated_at: PostgresDataType.TIMESTAMPTZ,
};

export const CREATE_USER_TABLE_QUERY = applyColumnConstraints<UserColumn>(
    createTable(DatabaseTable.USERS, usersTable, { pk: UserColumn.USER_ID }),
    {
        user_id: { notNull: true, unique: true, default: ColumnDefaultValue.UUID },
        role_id: { notNull: true },
        metadata: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
        created_at: { notNull: true, default: ColumnDefaultValue.NOW },
        updated_at: { notNull: true, default: ColumnDefaultValue.NOW },
    },
);
