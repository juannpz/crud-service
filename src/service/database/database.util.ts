import { ColumnConstraints } from "./database.definition.ts";

export function addReturningToQuery(query: string) {
    if (!query.includes("RETURNING"))
        query = query.replace(";", " RETURNING *;");

    return query;
}

export function applyColumnConstraints(query: string, constraints: Record<string, ColumnConstraints>): string {
    let modifiedQuery = query;

    for (const [columnName, columnConstraints] of Object.entries(constraints)) {
        const pattern = new RegExp(`"${columnName}"\\s+([^,)]+?)(?=,|\\)|$)`);

        modifiedQuery = modifiedQuery.replace(pattern, (match) => {
            let result = match.trim();

            if (columnConstraints.notNull && !result.includes('NOT NULL'))
                result += ' NOT NULL';

            if (columnConstraints.default && !result.includes('DEFAULT'))
                result += ` DEFAULT ${columnConstraints.default}`;

            if (columnConstraints.unique && !result.includes('UNIQUE'))
                result += ' UNIQUE';

            return result;
        });
    }

    return modifiedQuery;
}

export function stringifyObjectsInIterable(data: Record<string, unknown>[] | Iterable<Record<string, unknown>>): Record<string, unknown>[] {
    const items = Array.isArray(data) ? data : Array.from(data);

    return items.map(item => {
        const stringifiedItem: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(item)) {
            const isObject = value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);

            if (isObject)
                stringifiedItem[key] = JSON.stringify(value);
            else 
                stringifiedItem[key] = value;
        }

        return stringifiedItem;
    });
}

export function removeNullAndUndefinedFromIterable(data: Record<string, unknown>[] | Iterable<Record<string, unknown>>): Record<string, unknown>[] {
    const items = Array.isArray(data) ? data : Array.from(data);

    return items.map(item => {
        const cleanItem: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(item)) {
            if (value !== null && value !== undefined)
                cleanItem[key] = value;
        }

        return cleanItem;
    });
}