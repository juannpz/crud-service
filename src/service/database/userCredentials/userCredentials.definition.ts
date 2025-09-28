import { ColumnDefaultValue, DatabaseTable, NOTIFICATION_CHANNEL, PostgresDataType } from "../database.definition.ts";
import { applyColumnConstraints, createFunctionAndTrigger, createTable } from "@juannpz/extra-sql";
import { UserColumn } from "../users/users.definition.ts";

export interface UserCredentials {
    identity_id: number;
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number: Record<string, unknown>;
    metadata: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
}

interface UserCredentialsTable extends Record<string, PostgresDataType> {
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

const userCredentialsTable: UserCredentialsTable = {
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

export const CREATE_USER_CREDENTIALS_TABLE_QUERY = applyColumnConstraints<
    UserCredentialsColumn,
    DatabaseTable.USERS,
    UserColumn.USER_ID
>(
    createTable(DatabaseTable.USER_CREDENTIALS, userCredentialsTable, { pk: UserCredentialsColumn.IDENTITY_ID }),
    {
        user_id: { notNull: true, unique: true },
        phone_number: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
        email: { notNull: true, unique: true },
        first_name: { notNull: true },
        last_name: { notNull: true },
        metadata: { notNull: true, default: ColumnDefaultValue.EMPTY_JSONB },
        password: { notNull: true },
        created_at: { notNull: true, default: ColumnDefaultValue.NOW },
        updated_at: { notNull: true, default: ColumnDefaultValue.NOW },
    },
    {
        user_id: {
            table: DatabaseTable.USERS,
            column: UserColumn.USER_ID,
            onDelete: "CASCADE",
        },
    }
);

export const CREATE_USER_CREDENTIALS_NOTIFICATION_TRIGGER = createFunctionAndTrigger<
    UserCredentialsColumn,
    DatabaseTable,
    DatabaseTable,
    UserColumn,
    UserCredentialsColumn,
    UserColumn
>(
    'notify_user_credentials_change',
    {
		topLevelIdentifier: UserCredentialsColumn.USER_ID,
        trackNewValues: {
			user_id: true,
            phone_number: true,
            email: true,
            first_name: true,
            last_name: true,
            metadata: true,
        },
        trackOldValues: {
            user_id: true,
            phone_number: true,
            email: true,
            first_name: true,
            last_name: true,
            metadata: true,
        },
        joinTables: {
            users: {
                joinColumn: UserColumn.USER_ID,
                sourceColumn: UserCredentialsColumn.USER_ID,
                selectColumns: {
                    user_status_id: true,
                }
            }
        },
        channelName: NOTIFICATION_CHANNEL,
        triggers: {
            'user_credentials_change_trigger': {
                tableName: DatabaseTable.USER_CREDENTIALS,
                timing: 'AFTER',
                events: {
                    'UPDATE': true
                },
                forEach: "ROW",
            },
        }
    }
);