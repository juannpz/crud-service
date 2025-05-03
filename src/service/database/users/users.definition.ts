import { ColumnDefaultValue, DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { applyColumnConstraints, createTable } from "@juannpz/extra-sql";

export interface IUser {
    user_id: number;
    user_status_id: number;
    metadata: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
}

interface IUsersTable extends Record<string, PostgresDataType> {
    user_id: PostgresDataType.SERIAL;
    user_status_id: PostgresDataType.INTEGER;
    metadata: PostgresDataType.JSONB;
    created_at: PostgresDataType.TIMESTAMPTZ;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

export enum UserColumn {
    USER_ID = "user_id",
    USER_STATUS_ID = "user_status_id",
    METADATA = "metadata",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at"
}

const usersTable: IUsersTable = {
    user_id: PostgresDataType.SERIAL,
    user_status_id: PostgresDataType.INTEGER,
    metadata: PostgresDataType.JSONB,
    created_at: PostgresDataType.TIMESTAMPTZ,
    updated_at: PostgresDataType.TIMESTAMPTZ
}

export const CREATE_USER_TABLE_QUERY = applyColumnConstraints<UserColumn>(
    createTable(DatabaseTable.USERS, usersTable, { pk: UserColumn.USER_ID }),
    { 
        user_status_id: { notNull: true, default: ColumnDefaultValue.ONE },
        metadata: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
        created_at: { notNull: true, default: ColumnDefaultValue.NOW },
        updated_at: { notNull: true, default: ColumnDefaultValue.NOW },
    }
);