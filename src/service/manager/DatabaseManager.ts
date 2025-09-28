import { selectData, selectTsquery, insertInto, insertIntoData, updateData, removeNullAndUndefinedFromIterable, stringifyObjectsInIterable, stringifyObjectsInObject, removeNullAndUndefinedFromObject } from "@juannpz/extra-sql";
import { IBuildQueryResult, QueryOptions, QueryResult, QueryType, RetrievalFormat } from "../database/database.definition.ts";
import { PoolClient, QueryArrayResult, QueryObjectResult } from "@db/postgres";
import { DatabaseClient } from "../database/DatabaseClient.ts";
import { Result, ResUtil } from "@juannpz/deno-service-tools";
import { IDatabaseConfig } from "../service.definition.ts";

export class DatabaseManager extends DatabaseClient{

    private constructor() {
        super();
    }

    public static init(config: IDatabaseConfig) {
        this._init(config);
    }

    public static async query<T>(options: QueryOptions): Promise<Result<Required<QueryResult<T>>>> {
        const client = await this.getClient();

        try {
            switch (options.retrievalFormat) {
                case RetrievalFormat.ARRAY:
                    return await this.queryArray<T[]>(options, client);

                case RetrievalFormat.OBJECT:
                    return await this.queryObject<T>(options, client);
            
                default:
                    return ResUtil.Fail(`Inavalid retrieval format: ${options.retrievalFormat}`)
            }

        } catch (error) {
            return ResUtil.Fail("Error executing query", error);

        } finally {
            client.release();
        }
    }

    private static async queryObject<T>(options: QueryOptions, client: PoolClient): Promise<Result<Required<QueryObjectResult<T>>>> {
        try {
            const buildQueryResult = this.buildQuery(options);

            if (!buildQueryResult.ok)
                return buildQueryResult;

            const queryResult = await client.queryObject<T>(buildQueryResult.value.queryString, buildQueryResult.value.queryData);

            return ResUtil.Succeed(queryResult as Required<QueryObjectResult<T>>)

        } catch (error) {
            return ResUtil.Fail("Error executing query", error);
        }
    }

    private static async queryArray<T extends unknown[]>(options: QueryOptions, client: PoolClient): Promise<Result<Required<QueryArrayResult<T>>>> {
        try {
            const buildQueryResult = this.buildQuery(options);

            if (!buildQueryResult.ok)
                return buildQueryResult;

            const queryResult = await client.queryArray<T>(buildQueryResult.value.queryString, buildQueryResult.value.queryData);

            return ResUtil.Succeed(queryResult as Required<QueryArrayResult<T>>)

        } catch (error) {
            return ResUtil.Fail("Error executing query", error);
        }
    }

    private static buildQuery(options: QueryOptions): Result<IBuildQueryResult> {
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
                    const { query, data } = insertIntoData(options.table, this.formatIterableQueryData(options.data), { returning: true });

                    queryString = query;
                    queryData = data;
                    
                } else {
                    queryString = insertInto(options.table, this.formatIterableQueryData(options.data), { returning: true });
                }

                break;

            case QueryType.UPDATE: {
                const { query, data } = updateData(options.table, { ...this.formatObjectQueryData(options.data), updated_at: new Date() }, options.conditions, options.operator, options.separator, { returning: true });

                queryString = query;
                queryData = data;
                
                break;
            }
        
            default:
                return ResUtil.Fail("Missing query type in query options");
        }

        if (!queryString)
            return ResUtil.Fail("Error building query. Missing query string");

        return ResUtil.Succeed({ queryString, queryData });
    }

    private static formatIterableQueryData(data: Iterable<Record<string, unknown>>) {
        return stringifyObjectsInIterable(removeNullAndUndefinedFromIterable(data));
    }

    private static formatObjectQueryData(data: Record<string, unknown>) {
        return stringifyObjectsInObject(removeNullAndUndefinedFromObject(data));
    }
}