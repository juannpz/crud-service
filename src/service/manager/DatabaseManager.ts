import { selectData, selectTsquery, insertInto, insertIntoData, updateData, removeNullAndUndefinedFromIterable, stringifyObjectsInIterable, stringifyObjectsInObject, removeNullAndUndefinedFromObject } from "@juannpz/extra-sql";
import { IBuildQueryResult, QueryOptions, QueryResult, QueryType, RetrievalFormat } from "../database/database.definition.ts";
import { PoolClient, QueryArrayResult, QueryObjectResult } from "@db/postgres";
import { buildResponse, GenericResponse } from "@juannpz/deno-service-tools";
import { addReturningToQuery } from "../database/database.util.ts"; 
import { DatabaseClient } from "../database/DatabaseClient.ts";

export class DatabaseManager extends DatabaseClient{

    private constructor() {
        super();
    }

    public static async query<T>(options: QueryOptions): Promise<GenericResponse<Required<QueryResult<T>>>> {
        const client = await this.getClient();

        try {
            switch (options.retrievalFormat) {
                case RetrievalFormat.ARRAY:
                    return await this.queryArray<T[]>(options, client);

                case RetrievalFormat.OBJECT:
                    return await this.queryObject<T>(options, client);
            
                default:
                    return buildResponse({ success: false, message: `Inavalid retrieval format: ${options.retrievalFormat}` });
            }

        } catch (error) {
            return buildResponse({ success: false, error });

        } finally {
            client.release();
        }
    }

    private static async queryObject<T>(options: QueryOptions, client: PoolClient): Promise<GenericResponse<Required<QueryObjectResult<T>>>> {
        try {
            const buildQueryResult = this.buildQuery(options);

            if (!buildQueryResult.success)
                return buildQueryResult;

            const queryResult = await client.queryObject<T>(buildQueryResult.data.queryString, buildQueryResult.data.queryData);

            return buildResponse({ success: true, data: queryResult as Required<QueryObjectResult<T>> });

        } catch (error) {
            return buildResponse({ success: false, error });
        }
    }

    private static async queryArray<T extends unknown[]>(options: QueryOptions, client: PoolClient): Promise<GenericResponse<Required<QueryArrayResult<T>>>> {
        try {
            const buildQueryResult = this.buildQuery(options);

            if (!buildQueryResult.success)
                return buildQueryResult;

            const queryResult = await client.queryArray<T>(buildQueryResult.data.queryString, buildQueryResult.data.queryData);

            return buildResponse({ success: true, data: queryResult as Required<QueryArrayResult<T>> });

        } catch (error) {
            return buildResponse({ success: false, error });
        }
    }

    private static buildQuery(options: QueryOptions): GenericResponse<IBuildQueryResult> {
        let queryString: string | undefined = undefined;
        let queryData: unknown[] | undefined = undefined;

        switch (options.type) {
            case QueryType.SELECT:
                if (options.isTextSearch) {
                    queryString = selectTsquery(options.table, options.text, options.operator, options.options);

                } else {
                    const { query, data } = selectData(options.table, options.conditions, options.operator, options.separator);

                    queryString = query;
                    queryData = data;
                }

                break;
            
            case QueryType.INSERT:
                if (options.isParameterized) {
                    const { query, data } = insertIntoData(options.table, this.formatIterableQueryData(options.data));

                    queryString = query;
                    queryData = data;
                    
                } else {
                    queryString = insertInto(options.table, this.formatIterableQueryData(options.data));
                }

                queryString = addReturningToQuery(queryString);

                break;

            case QueryType.UPDATE: {
                const { query, data } = updateData(options.table, { ...this.formatObjectQueryData(options.data), updated_at: new Date() }, options.conditions, options.operator, options.separator );

                queryString = addReturningToQuery(query);;
                queryData = data;
                
                break;
            }
        
            default:
                return buildResponse({ success: false, message: "Missing query type in query options" });
        }

        if (!queryString)
            return buildResponse({ success: false, message: "Could not build query" });

        return buildResponse({ success: true, data: { queryString, queryData } });
    }

    private static formatIterableQueryData(data: Iterable<Record<string, unknown>>) {
        return stringifyObjectsInIterable(removeNullAndUndefinedFromIterable(data));
    }

    private static formatObjectQueryData(data: Record<string, unknown>) {
        return stringifyObjectsInObject(removeNullAndUndefinedFromObject(data));
    }
}