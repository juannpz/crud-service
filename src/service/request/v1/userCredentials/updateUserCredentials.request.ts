import {
    DatabaseTable,
    QuerySeparator,
    QueryType,
    RetrievalFormat,
} from "../../../database/database.definition.ts";
import { UserCredentials } from "../../../database/userCredentials/userCredentials.definition.ts";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { Router, ValidationResult } from "@juannpz/deno-service-tools";

interface Body extends Record<string, unknown> {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone: Record<string, unknown>;
    metadata: Record<string, unknown>;
}

export const updateUserCredentialsRequest = Router.put<ExtendedContextVariables>(
    "/user-credentials/:user_id?",
)
    .describe("User credentials update")
    .pathParam<"user_id", string>("user_id")
    .body<Body>()
    .validateBody(validateBody)
    .queryParam<"format", RetrievalFormat>("format", {
        defaultValue: RetrievalFormat.OBJECT,
    })
    .queryParam<"user_id", string>("user_id")
    .queryParam<"identity_id", number>("identity_id", {
        transform: (value) => parseInt(value as string),
    })
    .headerParam("Authorization")
    .withVariables<ExtendedContextVariables>()
    .handler(async (context) => {
        const { email, first_name, last_name, password, phone, metadata } = context.body;
        const userId = context.params.user_id || context.query.user_id;
        const { format, identity_id } = context.query;

        if (!userId && !identity_id) {
            return context.c.json(
                { message: "User ID or identity ID is required" },
                400,
            );
        }

        const updateUserCredentialsResult = await DatabaseManager.query<
            UserCredentials
        >({
            conditions: {
                user_id: userId,
                identity_id,
            },
            separator: QuerySeparator.OR,
            table: DatabaseTable.USER_CREDENTIALS,
            retrievalFormat: format,
            type: QueryType.UPDATE,
            data: { email, first_name, last_name, password, phone, metadata },
        });

        if (!updateUserCredentialsResult.ok) {
            console.error(updateUserCredentialsResult.message);

            return context.c.json({ message: updateUserCredentialsResult.message });
        }

        return context.c.json({
            message: `${updateUserCredentialsResult.value.rowCount} ${
                updateUserCredentialsResult.value.rowCount === 1 ? "entry" : "entrys"
            } updated`,
            data: updateUserCredentialsResult.value.rows,
        }, 200);
    });

function validateBody(body: Body): ValidationResult {
    if (Object.entries(body).length === 0) {
        return { valid: false, message: "Body is empty" };
    }

    return { valid: true };
}
