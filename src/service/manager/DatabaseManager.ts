import { IBuildQueryResult, QueryConfig, QueryResult, QueryType, RetrievalFormat } from "../database/database.definition.ts";
import { selectData, selectTsquery, insertInto, insertIntoData } from "@nodef/extra-sql";
import { buildResponse, GenericResponse } from "@juannpz/deno-service-tools";
import { QueryArrayResult, QueryObjectResult } from "@db/postgres";
import { addReturningToQuery, removeNullAndUndefinedFromIterable, stringifyObjectsInIterable } from "../database/database.util.ts";
import { DatabaseClient } from "../database/DatabaseClient.ts";

export class DatabaseManager extends DatabaseClient{

    private constructor() {
        super();
    }

    public static async disconnect(): Promise<GenericResponse<true>> {
        try {
            if (this.client)
                await this.client.end();

            return buildResponse({ success: true, data: true });

        } catch (error) {
            return buildResponse({ success: false, error });
        }
    }

    public static async query<T>(config: QueryConfig): Promise<GenericResponse<Required<QueryResult<T>>>> {
        try {
            switch (config.retrievalFormat) {
                case RetrievalFormat.ARRAY:
                    return await this.queryArray<T[]>(config);

                case RetrievalFormat.OBJECT:
                    return await this.queryObject<T>(config);
            
                default:
                    return buildResponse({ success: false, message: `Inavalid retrieval format: ${config.retrievalFormat}` });
            }

        } catch (error) {
            return buildResponse({ success: false, error });
        }
    }

    private static async queryObject<T>(config: QueryConfig): Promise<GenericResponse<Required<QueryObjectResult<T>>>> {
        if (!this.client)
            return buildResponse({ success: false, message: "Postgres client not initialized" });

        try {
            const buildQueryResult = this.buildQuery(config);

            if (!buildQueryResult.success)
                return buildQueryResult;

            const queryResult = await this.client.queryObject<T>(buildQueryResult.data.queryString, buildQueryResult.data.queryData);

            return buildResponse({ success: true, data: queryResult as Required<QueryObjectResult<T>> });

        } catch (error) {
            return buildResponse({ success: false, error });
        }
    }

    public static async queryArray<T extends unknown[]>(config: QueryConfig): Promise<GenericResponse<Required<QueryArrayResult<T>>>> {
        if (!this.client)
            return buildResponse({ success: false, message: "Postgres client not initialized" });

        try {
            const buildQueryResult = this.buildQuery(config);

            if (!buildQueryResult.success)
                return buildQueryResult;

            const queryResult = await this.client.queryArray<T>(buildQueryResult.data.queryString, buildQueryResult.data.queryData);

            return buildResponse({ success: true, data: queryResult as Required<QueryArrayResult<T>> });

        } catch (error) {
            return buildResponse({ success: false, error });
        }
    }

    private static buildQuery(config: QueryConfig): GenericResponse<IBuildQueryResult> {
        let queryString: string | undefined = undefined;
        let queryData: unknown[] | undefined = undefined;

        switch (config.type) {
            case QueryType.SELECT:
                if (config.isTextSearch) {
                    queryString = selectTsquery(config.table, config.text, config.operator, config.options);

                } else {
                    const { query, data } = selectData(config.table, config.conditions, config.operator, config.separator);

                    queryString = query;
                    queryData = data;
                }

                break;
            
            case QueryType.INSERT:
                if (config.isParameterized) {
                    const { query, data } = insertIntoData(config.table, this.formatQueryData(config.data));

                    queryString = query;
                    queryData = data;
                    
                } else {
                    queryString = insertInto(config.table, this.formatQueryData(config.data));
                }

                queryString = addReturningToQuery(queryString);

                break;
        
            default:
                return buildResponse({ success: false, message: "Missing query type in query config" });
        }

        if (!queryString)
            return buildResponse({ success: false, message: "Could not build query" });

        return buildResponse({ success: true, data: { queryString, queryData } });
    }

    private static formatQueryData(data: Record<string, unknown>[] | Iterable<Record<string, unknown>>) {
        const dataWithoutNullAndUndefined = removeNullAndUndefinedFromIterable(data);

        return stringifyObjectsInIterable(dataWithoutNullAndUndefined);
    }
}