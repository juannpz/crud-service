import { QueryArrayResult, QueryObjectResult } from "@db/postgres";
import { SelectTsqueryOptions } from "@nodef/extra-sql";

interface IQueryConfig {
    type: QueryType;
    table: DatabaseTable;
    conditions: Record<string, unknown>;
    retrievalFormat: RetrievalFormat;
    operator?: QueryOperator;
    separator?: QuerySeparator;
}

export interface ISelectQueryConfig extends IQueryConfig {
    type: QueryType.SELECT;
    isTextSearch: false;
}

export interface ITextSearchSelectQueryConfig extends IQueryConfig {
    type: QueryType.SELECT;
    isTextSearch: true;
    text: string;
    column: string;
    options: SelectTsqueryOptions;
}

export interface IInsertQueryConfig extends IQueryConfig {
    type: QueryType.INSERT;
    isParameterized: false;
    data: Iterable<Record<string, unknown>>;
}

export interface IParameterizedInsertQueryConfig extends IQueryConfig {
    type: QueryType.INSERT;
    isParameterized: true;
    data: Record<string, unknown>[];
}

export interface ICreateTableQueryConfig extends IQueryConfig {
    type: QueryType.CREATE_TABLE;
    data: string;
}

export type QueryConfig = ISelectQueryConfig | ITextSearchSelectQueryConfig | IInsertQueryConfig | IParameterizedInsertQueryConfig;

export type QueryResult<T> = QueryObjectResult<T> | QueryArrayResult<T[]>;

export interface IBuildQueryResult {
    queryString: string;
    queryData?: unknown[];
}

export enum ColumnDefaultValue {
    CURRENT_TIMESTAMP = "CURRENT_TIMESTAMP",
    NOW = "NOW()",
    NULL = "NULL",
    TRUE = "TRUE",
    FALSE = "FALSE",
    ZERO = "0",
    EMPTY_STRING = "''",
    EMPTY_JSONB = "'{}'",
    ONE = "1"
}

export interface ColumnConstraints {
    notNull?: boolean;
    default?: ColumnDefaultValue;
    unique?: boolean;
}

export enum QueryType {
    SELECT = "SELECT",
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    CREATE_TABLE = "CREATE TABLE",
    DROP_TABLE = "DROP TABLE"
}

export enum DatabaseTable {
    USERS = "users",
    USER_CREDENTIALS = "user_credentials",
    USER_STATUS = "user_status"
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
    IS_NOT_NULL = "IS NOT NULL"
}

export enum QuerySeparator {
    AND = "AND",
    OR = "OR"
}

export enum RetrievalFormat {
    OBJECT = "object",
    ARRAY = "array"
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
    ARRAY = "ARRAY"
}