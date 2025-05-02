import { ColumnConstraints } from "./database.definition.ts";

export function addReturningToQuery(query: string) {
    if (!query.includes("RETURNING"))
        query = query.replace(";", " RETURNING *;");

    return query;
}

export function applyColumnConstraints(
    query: string,
    constraints: Record<string, ColumnConstraints>
): string {
    let modifiedQuery = query;

    for (const [columnName, columnConstraints] of Object.entries(constraints)) {
        const pattern = new RegExp(`"${columnName}"\\s+([^,)]+?)(?=,|\\)|$)`);

        modifiedQuery = modifiedQuery.replace(pattern, (match) => {
            let result = match.trim();

            if (columnConstraints.notNull && !result.includes('NOT NULL')) {
                result += ' NOT NULL';
            }

            if (columnConstraints.default && !result.includes('DEFAULT')) {
                result += ` DEFAULT ${columnConstraints.default}`;
            }

            if (columnConstraints.unique && !result.includes('UNIQUE')) {
                result += ' UNIQUE';
            }

            return result;
        });
    }

    return modifiedQuery;
}