import { ColumnDefaultValue, DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { applyColumnConstraints } from "../database.util.ts";
import { createTable } from "@nodef/extra-sql";

export interface IUserStatus {
    user_status_id: number;
    user_status_name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

interface IUserStatusTable extends Record<string, PostgresDataType> {
    user_status_id: PostgresDataType.SERIAL;
    user_status_name: PostgresDataType.TEXT;
    description: PostgresDataType.TEXT;
    created_at: PostgresDataType.TIMESTAMPTZ;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

enum UserStatusColumn {
    USER_STATUS_ID = "user_status_id",
    USER_STATUS_NAME = "user_status_name",
    DESCRIPTION = "description",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at"
}

const userStatusTable: IUserStatusTable = {
    user_status_id: PostgresDataType.SERIAL,
    user_status_name: PostgresDataType.TEXT,
    description: PostgresDataType.TEXT,
    created_at: PostgresDataType.TIMESTAMPTZ,
    updated_at: PostgresDataType.TIMESTAMPTZ
}

export const CREATE_USER_STATUS_TABLE_QUERY = applyColumnConstraints<UserStatusColumn>(
    createTable(DatabaseTable.USER_STATUS, userStatusTable, { pk: UserStatusColumn.USER_STATUS_ID }),
    { 
        user_status_name: { notNull: true, unique: true },
        description: { notNull: true },
        created_at: { notNull: true, default: ColumnDefaultValue.NOW },
        updated_at: { notNull: true, default: ColumnDefaultValue.NOW },
    }
);