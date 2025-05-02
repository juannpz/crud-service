import { DatabaseTable, QueryType, RetrievalFormat } from "../../../database/database.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { IUser } from "../../../database/users/users.definition.ts";
import { IContextVariables } from "../../request.definition.ts";
import { Router } from "@juannpz/deno-service-tools";
import { IUserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";

interface IBody extends Record<string, unknown> {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number: Record<string, unknown>;
    metadata: Record<string, unknown>;
}

export const postUserCredentialsRequest = Router.post<IContextVariables>("/user-credentials")
.describe("user_credentials insertion")
.body<IBody>()
.validateBody<IBody>(validateBody)
.queryParam<"format", RetrievalFormat>("format", { required: true })
.headerParam("Authorization")
.withVariables<IContextVariables>()
.handler(async (context) => {
    const { metadata, email, first_name, last_name, password, phone_number, user_id } = context.body;

    const { format } = context.query;

    const createUserCredentialsResult = await DatabaseManager.query<IUserCredentials>({
        conditions: {},
        table: DatabaseTable.USER_CREDENTIALS,
        retrievalFormat: format,
        type: QueryType.INSERT,
        isParameterized: true,
        data: [ { user_id, email, first_name, last_name, password, phone_number, metadata } ]
    });

    if (!createUserCredentialsResult.success)
        return context.c.json({ message: createUserCredentialsResult.message }, createUserCredentialsResult.code);

    return context.c.json({
        message: `${createUserCredentialsResult.data.rowCount} ${createUserCredentialsResult.data.rowCount === 1 ? "entry" : "entrys"} created`,
        data: createUserCredentialsResult.data.rows
    }, 200);
});

function validateBody(body: IBody) {
    if (!body.user_id || !body.email || !body.first_name || !body.last_name || !body.password || !body.phone_number)
        return false;
    
    return true;
}