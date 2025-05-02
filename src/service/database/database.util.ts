import { ColumnConstraints, ForeignKeyConstraint } from "./database.definition.ts";

export function addReturningToQuery(query: string) {
    if (!query.includes("RETURNING"))
        query = query.replace(";", " RETURNING *;");

    return query;
}

export function applyColumnConstraints<
    SourceColumn extends string = string,
    TargetTable extends string = string,
    TargetColumn extends string = string
>(
    query: string,
    constraints: Partial<Record<SourceColumn, ColumnConstraints>>,
    foreignKeys?: Partial<Record<SourceColumn, ForeignKeyConstraint<TargetTable, TargetColumn>>>
): string {
    let modifiedQuery = query;

    for (const [columnName, columnConstraints] of Object.entries(constraints) as [SourceColumn, ColumnConstraints][]) {
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

    if (foreignKeys && Object.keys(foreignKeys).length > 0) {
        const lastParenIndex = modifiedQuery.lastIndexOf(')');

        if (lastParenIndex !== -1) {
            const foreignKeysConstraints = (Object.entries(foreignKeys) as [SourceColumn, ForeignKeyConstraint<TargetTable, TargetColumn>][])
                .map(([columnName, fkInfo]) => {
                    let constraint = `,\n  CONSTRAINT "fk_${columnName}" FOREIGN KEY ("${columnName}") `;
                    constraint += `REFERENCES ${fkInfo.table}("${fkInfo.column}")`;

                    if (fkInfo.onDelete)
                        constraint += ` ON DELETE ${fkInfo.onDelete}`;

                    if (fkInfo.onUpdate)
                        constraint += ` ON UPDATE ${fkInfo.onUpdate}`;

                    return constraint;
                }).join('');

            modifiedQuery = modifiedQuery.slice(0, lastParenIndex) + foreignKeysConstraints + modifiedQuery.slice(lastParenIndex);
        }
    }

    return modifiedQuery;
}

export function stringifyObjectsInIterable(data: Iterable<Record<string, unknown>>): Record<string, unknown>[] {
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

export function removeNullAndUndefinedFromIterable(data: Iterable<Record<string, unknown>>): Record<string, unknown>[] {
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

export function stringifyObjectsInObject(data: Record<string, unknown>): Record<string, unknown> {
    const stringifiedObject: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
        const isObject = value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);

        if (isObject)
            stringifiedObject[key] = JSON.stringify(value);
        else
            stringifiedObject[key] = value;
    }

    return stringifiedObject;
}

export function removeNullAndUndefinedFromObject(data: Record<string, unknown>): Record<string, unknown> {
    const cleanObject: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined)
            cleanObject[key] = value;
    }

    return cleanObject;
}