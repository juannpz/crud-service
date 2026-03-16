import { applyColumnConstraints, ColumnDefaultValue, createTable } from "@juannpz/extra-sql";
import { DatabaseTable, PostgresDataType } from "../database.definition.ts";
import { UserColumn } from "../users/users.definition.ts";

export interface ApiKey {
    api_key_id: string;
    user_id: string;
    public_key: string;
    private_key: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

interface ApiKeysTable extends Record<string, PostgresDataType> {
    api_key_id: PostgresDataType.UUID;
    user_id: PostgresDataType.UUID;
    public_key: PostgresDataType.TEXT;
    private_key: PostgresDataType.TEXT;
    description: PostgresDataType.TEXT;
    created_at: PostgresDataType.TIMESTAMPTZ;
    updated_at: PostgresDataType.TIMESTAMPTZ;
}

enum ApiKeysColumn {
    API_KEY_ID = "api_key_id",
    USER_ID = "user_id",
    PUBLIC_KEY = "public_key",
    PRIVATE_KEY = "private_key",
    DESCRIPTION = "description",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at",
}

const apiKeysTable: ApiKeysTable = {
    api_key_id: PostgresDataType.UUID,
    user_id: PostgresDataType.UUID,
    public_key: PostgresDataType.TEXT,
    private_key: PostgresDataType.TEXT,
    description: PostgresDataType.TEXT,
    created_at: PostgresDataType.TIMESTAMPTZ,
    updated_at: PostgresDataType.TIMESTAMPTZ,
};

export const CREATE_API_KEYS_TABLE_QUERY = applyColumnConstraints<
    ApiKeysColumn,
    DatabaseTable.USERS,
    UserColumn.USER_ID
>(
    createTable(DatabaseTable.API_KEYS, apiKeysTable, {
        pk: ApiKeysColumn.API_KEY_ID,
    }),
    {
        api_key_id: { notNull: true, default: ColumnDefaultValue.UUID },
        user_id: { notNull: true },
        public_key: { notNull: true, unique: true },
        private_key: { notNull: true, unique: true },
        description: { notNull: true },
        created_at: { notNull: true, default: ColumnDefaultValue.NOW },
        updated_at: { notNull: true, default: ColumnDefaultValue.NOW },
    },
    {
        user_id: {
            table: DatabaseTable.USERS,
            column: UserColumn.USER_ID,
        },
    },
);
