export function addReturningToQuery(query: string) {
    if (!query.includes("RETURNING"))
        query = query.replace(";", " RETURNING *;");

    return query;
}