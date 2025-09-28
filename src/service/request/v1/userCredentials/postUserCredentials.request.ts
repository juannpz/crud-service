import { DatabaseTable, QueryType, RetrievalFormat } from "../../../database/database.definition.ts";
import { UserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";

interface IBody extends Record<string, unknown> {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number: Record<string, unknown>;
    metadata: Record<string, unknown>;
}

export const postUserCredentialsRequest = Router.post<ExtendedContextVariables>("/user-credentials")
.describe("User credentials update")
.body<IBody>()
.validateBody(validateBody)
.queryParam<"format", RetrievalFormat>("format", { required: true })
.headerParam("Authorization")
.withVariables<ExtendedContextVariables>()
.handler(async (context) => {
    const { metadata, email, first_name, last_name, password, phone_number, user_id } = context.body;

    const { format } = context.query;

    const createUserCredentialsResult = await DatabaseManager.query<UserCredentials>({
        conditions: {},
        table: DatabaseTable.USER_CREDENTIALS,
        retrievalFormat: format,
        type: QueryType.INSERT,
        isParameterized: true,
        data: [ { user_id, email, first_name, last_name, password, phone_number, metadata } ]
    });

    if (!createUserCredentialsResult.ok) {
        console.error(createUserCredentialsResult.message);

        return context.c.json({ message: createUserCredentialsResult.message });
    }

    return context.c.json({
        message: `${createUserCredentialsResult.value.rowCount} ${createUserCredentialsResult.value.rowCount === 1 ? "entry" : "entrys"} created`,
        data: createUserCredentialsResult.value.rows
    }, 200);
});

function validateBody(body: IBody) {
    if (!body.user_id || !body.email || !body.first_name || !body.last_name || !body.password || !body.phone_number || !body.metadata)
        return false;
    
    return true;
}