import { ColumnDefaultValue, DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { applyColumnConstraints } from "../database.util.ts";
import { createTable } from "@nodef/extra-sql";

export interface IUser {
    user_id: number;
    user_status_id: number;
    metadata: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
}

interface IUserTable extends Record<string, PostgresDataType> {
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

const userTable: IUserTable = {
    user_id: PostgresDataType.SERIAL,
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
        [UserColumn.USER_STATUS_ID]: { notNull: true, default: ColumnDefaultValue.ONE },
        [UserColumn.METADATA]: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
    }
);