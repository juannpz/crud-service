import { ColumnDefaultValue, DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { createTable } from "@nodef/extra-sql";
import { applyColumnConstraints } from "../database.util.ts";

export interface IUser<T = Record<string, unknown>> {
    user_id: number;
    description: string;
    user_status_id: number;
    metadata: T;
    created_at: Date;
    updated_at: Date;
}

interface IUserTable extends Record<string, PostgresDataType> {
    user_id: PostgresDataType.SERIAL;
    description: PostgresDataType.TEXT;
    user_status_id: PostgresDataType.INTEGER;
    metadata: PostgresDataType.JSONB;
    created_at: PostgresDataType.TIMESTAMPTZ;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

enum UserColumn {
    USER_ID = "user_id",
    DESCRIPTION = "description",
    USER_STATUS_ID = "user_status_id",
    METADATA = "metadata",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at"
}

const userTable: IUserTable = {
    user_id: PostgresDataType.SERIAL,
    description: PostgresDataType.TEXT,
    user_status_id: PostgresDataType.INTEGER,
    metadata: PostgresDataType.JSONB,
    created_at: PostgresDataType.TIMESTAMPTZ,
    updated_at: PostgresDataType.TIMESTAMPTZ
}

export const CREATE_USER_TABLE_QUERY = applyColumnConstraints(
    createTable(DatabaseTable.USERS, userTable, { pk: UserColumn.USER_ID }),
    { 
        [UserColumn.CREATED_AT]: { notNull: true, default: ColumnDefaultValue.NOW },
        [UserColumn.UPDATED_AT]: { notNull: true, default: ColumnDefaultValue.NOW },
        [UserColumn.DESCRIPTION]: { notNull: true },
        [UserColumn.USER_STATUS_ID]: { notNull: true },
        [UserColumn.METADATA]: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
    }
);