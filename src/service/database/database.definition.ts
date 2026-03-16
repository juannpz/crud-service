import { ColumnDefaultValue, SelectTsqueryOptions } from "@juannpz/extra-sql";
import { QueryArrayResult, QueryObjectResult } from "@db/postgres";

interface BaseQueryOptions {
    type: QueryType;
    table: DatabaseTable;
    conditions: Record<string, unknown>;
    retrievalFormat: RetrievalFormat;
    operator?: QueryOperator;
    separator?: QuerySeparator;
}

export interface SelectQueryOptions extends BaseQueryOptions {
    type: QueryType.SELECT;
    isTextSearch: false;
}

export interface TextSearchSelectQueryOptions extends BaseQueryOptions {
    type: QueryType.SELECT;
    isTextSearch: true;
    text: string;
    column: string;
    options: SelectTsqueryOptions;
}

export interface InsertQueryOptions extends BaseQueryOptions {
    type: QueryType.INSERT;
    isParameterized: true;
    data: Iterable<Record<string, unknown>>;
}

export interface ParameterizedInsertQueryOptions extends BaseQueryOptions {
    type: QueryType.INSERT;
    isParameterized: true;
    data: Record<string, unknown>[];
}

export interface UpdatedQueryOptions extends BaseQueryOptions {
    type: QueryType.UPDATE;
    data: Record<string, unknown>;
}

export type QueryOptions =
    | SelectQueryOptions
    | TextSearchSelectQueryOptions
    | InsertQueryOptions
    | ParameterizedInsertQueryOptions
    | UpdatedQueryOptions;

export type QueryResult<T> = QueryObjectResult<T> | QueryArrayResult<T[]>;

export interface BuildQueryResult {
    queryString: string;
    queryData?: unknown[];
}

export interface ColumnConstraints {
    notNull?: boolean;
    default?: ColumnDefaultValue;
    unique?: boolean;
}

export interface ForeignKeyConstraint<
    TargetTable = string,
    TargetColumn = string,
> {
    table: TargetTable;
    column: TargetColumn;
    onDelete?: "CASCADE" | "SET NULL" | "SET DEFAULT" | "RESTRICT" | "NO ACTION";
    onUpdate?: "CASCADE" | "SET NULL" | "SET DEFAULT" | "RESTRICT" | "NO ACTION";
}

export enum QueryType {
    SELECT = "SELECT",
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    CREATE_TABLE = "CREATE TABLE",
    DROP_TABLE = "DROP TABLE",
}

export enum DatabaseTable {
    USERS = "users",
    USER_CREDENTIALS = "user_credentials",
    USER_STATUS = "user_status",
    ROLES = "roles",
    API_KEYS = "api_keys",
    CATEGORIES = "categories",
    SALES_CHANNELS = "sales_channels",
    PRODUCTS = "products",
    PRODUCT_PRICES = "product_prices",
    INVENTORY_TRANSACTIONS = "inventory_transactions",
    V_PRODUCTS_COMPLETE = "v_products_complete",
}

export enum QueryOperator {
    EQUALS = "=",
    GREATER_THAN = ">",
    LESS_THAN = "<",
    GREATER_THAN_OR_EQUALS = ">=",
    LESS_THAN_OR_EQUALS = "<=",
    NOT_EQUALS = "<>",
    LIKE = "LIKE",
    IN = "IN",
    BETWEEN = "BETWEEN",
    EXISTS = "EXISTS",
    IS_NULL = "IS NULL",
    IS_NOT_NULL = "IS NOT NULL",
    ILIKE = "ILIKE",
}

export enum QuerySeparator {
    AND = "AND",
    OR = "OR",
}

export enum RetrievalFormat {
    OBJECT = "object",
    ARRAY = "array",
}

export enum PostgresDataType {
    SMALLINT = "SMALLINT",
    INTEGER = "INTEGER",
    BIGINT = "BIGINT",
    DECIMAL = "DECIMAL",
    NUMERIC = "NUMERIC",
    REAL = "REAL",
    DOUBLE_PRECISION = "DOUBLE PRECISION",
    SERIAL = "SERIAL",
    BIGSERIAL = "BIGSERIAL",
    VARCHAR = "VARCHAR",
    TEXT = "TEXT",
    CHAR = "CHAR",
    TIMESTAMP = "TIMESTAMP",
    TIMESTAMPTZ = "TIMESTAMPTZ",
    DATE = "DATE",
    TIME = "TIME",
    BOOLEAN = "BOOLEAN",
    JSON = "JSON",
    JSONB = "JSONB",
    UUID = "UUID",
    ARRAY = "ARRAY",
}

export const NOTIFICATION_CHANNEL = "table_changes";
