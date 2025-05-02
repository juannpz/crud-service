import { ColumnDefaultValue, DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { createTable } from "@nodef/extra-sql";
import { applyColumnConstraints } from "../database.util.ts";

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

export const CREATE_USER_STATUS_TABLE_QUERY = applyColumnConstraints(
    createTable(DatabaseTable.USER_STATUS, userStatusTable, { pk: UserStatusColumn.USER_STATUS_ID }),
    { 
        [UserStatusColumn.CREATED_AT]: { notNull: true, default: ColumnDefaultValue.NOW },
        [UserStatusColumn.UPDATED_AT]: { notNull: true, default: ColumnDefaultValue.NOW },
        [UserStatusColumn.USER_STATUS_NAME]: { notNull: true, unique: true },
        [UserStatusColumn.DESCRIPTION]: { notNull: true },
        [UserStatusColumn.USER_STATUS_ID]: { notNull: true, unique: true }
    }
);