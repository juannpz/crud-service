import { SelectTsqueryOptions } from "@nodef/extra-sql";

export interface IQueryConfig {
    type: QueryType;
    table: DatabaseTable;
    conditions: Record<string, unknown>;
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
    data: Record<string, unknown>[];
}

export interface IParameterizedInsertQueryConfig extends IQueryConfig {
    type: QueryType.INSERT;
    isParameterized: true;
    data: Iterable<Record<string, unknown>>;
}

export interface ICreateTableQueryConfig extends IQueryConfig {
    type: QueryType.CREATE_TABLE;
    data: string;
}

export type QueryConfig = ISelectQueryConfig | ITextSearchSelectQueryConfig | IInsertQueryConfig;

export interface IBuildQueryResult {
    queryString: string;
    queryData?: unknown[];
}

export enum QueryType {
    SELECT = 'SELECT',
    INSERT = 'INSERT',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CREATE_TABLE = 'CREATE TABLE',
    DROP_TABLE = 'DROP TABLE'
}

export enum DatabaseTable {
    USER = 'users',
    USER_CREDENTIALS = 'user_credentials'
}

export enum QueryOperator {
    EQUALS = '=',
    GREATER_THAN = '>',
    LESS_THAN = '<',
    GREATER_THAN_OR_EQUALS = '>=',
    LESS_THAN_OR_EQUALS = '<=',
    NOT_EQUALS = '<>',

    LIKE = 'LIKE',
    IN = 'IN',
    BETWEEN = 'BETWEEN',
    EXISTS = 'EXISTS',
    IS_NULL = 'IS NULL',
    IS_NOT_NULL = 'IS NOT NULL'
}

export enum QuerySeparator {
    AND = 'AND',
    OR = 'OR'
}