import { ColumnDefaultValue, DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { applyColumnConstraints } from "../database.util.ts";
import { createTable } from "@nodef/extra-sql";

export interface IUserCredentials<M = Record<string, unknown>, P = Record<string, unknown>> {
    identity_id: number;
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number: P
    metadata: M;
    created_at: Date;
    updated_at: Date;
}

interface IUserCredentialsTable extends Record<string, PostgresDataType> {
    identity_id: PostgresDataType.SERIAL;
    user_id: PostgresDataType.INTEGER;
    email: PostgresDataType.TEXT;
    first_name: PostgresDataType.TEXT;
    last_name: PostgresDataType.TEXT;
    password: PostgresDataType.TEXT;
    phone_number: PostgresDataType.JSONB;
    metadata: PostgresDataType.JSONB;
    created_at: PostgresDataType.TIMESTAMPTZ;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

enum UserCredentialsColumn {
    IDENTITY_ID = "identity_id",
    USER_ID = "user_id",
    EMAIL = "email",
    FIRST_NAME = "first_name",
    LAST_NAME = "last_name",
    PASSWORD = "password",
    PHONE_NUMBER = "phone_number",
    METADATA = "metadata",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at"
}

const userCredentialsTable: IUserCredentialsTable = {
    identity_id: PostgresDataType.SERIAL,
    user_id: PostgresDataType.INTEGER,
    email: PostgresDataType.TEXT,
    first_name: PostgresDataType.TEXT,
    last_name: PostgresDataType.TEXT,
    password: PostgresDataType.TEXT,
    phone_number: PostgresDataType.JSONB,
    metadata: PostgresDataType.JSONB,
    created_at: PostgresDataType.TIMESTAMPTZ,
    updated_at: PostgresDataType.TIMESTAMPTZ
}

export const CREATE_USER_CREDENTIALS_TABLE_QUERY = applyColumnConstraints(
    createTable(DatabaseTable.USER_CREDENTIALS, userCredentialsTable, { pk: UserCredentialsColumn.IDENTITY_ID }),
    { 
        [UserCredentialsColumn.CREATED_AT]: { notNull: true, default: ColumnDefaultValue.NOW },
        [UserCredentialsColumn.UPDATED_AT]: { notNull: true, default: ColumnDefaultValue.NOW },
        [UserCredentialsColumn.USER_ID]: { notNull: true, unique: true },
        [UserCredentialsColumn.EMAIL]: { notNull: true, unique: true },
        [UserCredentialsColumn.PASSWORD]: { notNull: true },
        [UserCredentialsColumn.PHONE_NUMBER]: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
        [UserCredentialsColumn.FIRST_NAME]: { notNull: true },
        [UserCredentialsColumn.LAST_NAME]: { notNull: true },
        [UserCredentialsColumn.METADATA]: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
    }
);