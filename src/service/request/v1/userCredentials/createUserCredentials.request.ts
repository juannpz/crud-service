import {
    DatabaseTable,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { UserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { Router, ValidationResult } from "@juannpz/deno-service-tools";
import { hash } from "@felix/bcrypt";

interface Body extends Record<string, unknown> {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone: Record<string, unknown>;
    metadata: Record<string, unknown>;
}

export const createUserCredentialsRequest = Router.post<ExtendedContextVariables>(
    "/user-credentials",
)
    .describe("User credentials update")
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", { required: true })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { metadata, email, password, first_name, last_name, phone, user_id } = context.body;

        const { format } = context.query;

        const passwordHash = await hash(password);

        const createUserCredentialsResult = await DatabaseManager.query<
            UserCredentials
        >({
            conditions: {},
            table: DatabaseTable.USER_CREDENTIALS,
            retrievalFormat: format,
            type: QueryType.INSERT,
            isParameterized: true,
            data: [{
                user_id,
                email,
                first_name,
                last_name,
                password: passwordHash,
                phone,
                metadata,
            }],
        });

        if (!createUserCredentialsResult.ok) {
            console.error(createUserCredentialsResult.message);

            return context.c.json({
                message: createUserCredentialsResult.message,
                error: createUserCredentialsResult.error,
            });
        }

        return context.c.json({
            message: `${createUserCredentialsResult.value.rowCount} ${
                createUserCredentialsResult.value.rowCount === 1 ? "entry" : "entrys"
            } created`,
            data: createUserCredentialsResult.value.rows,
        }, 200);
    });

function validateBody(body: Body): ValidationResult {
    if (
        !body.user_id || !body.email || !body.first_name || !body.last_name ||
        !body.password || !body.phone
    ) {
        return { valid: false, message: "Missing required properties in body" };
    }

    return { valid: true };
}
