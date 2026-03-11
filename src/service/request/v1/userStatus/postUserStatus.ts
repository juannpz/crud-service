import { DatabaseTable, QueryType, RetrievalFormat } from "../../../database/database.definition.ts";
import { UserStatus } from "../../../database/userStatus/userStatus.definition.ts";
import { ExtendedContextVariables } from "../../request.definition.ts";
import { Router, ValidationResult } from "@juannpz/deno-service-tools";
import { DatabaseManager } from "../../../manager/DatabaseManager.ts";

interface Body extends Record<string, unknown> {
	name: number;
	description: string;
}

export const postUserStatusRequest = Router.post<ExtendedContextVariables>("/user-status")
.describe("User status creation")
.body<Body>()
.validateBody(validateBody)
.queryParam<"format", RetrievalFormat>("format", { required: true })
.headerParam("Authorization")
.withVariables<ExtendedContextVariables>()
.handler(async (context) => {
		const { name, description } = context.body;
		const { format } = context.query;

		const createUserStatusResult = await DatabaseManager.query<UserStatus>({
			conditions: {},
			table: DatabaseTable.USER_STATUS,
			retrievalFormat: format,
			type: QueryType.INSERT,
			isParameterized: false,
			data: [ { name, description } ]
		});

	if (!createUserStatusResult.ok) {
		console.error(createUserStatusResult.message);

		return context.c.json({ message: createUserStatusResult.message });
	}

		return context.c.json({
			message: `${createUserStatusResult.value.rowCount} ${createUserStatusResult.value.rowCount === 1 ? "entry" : "entrys"} created`,
			data: createUserStatusResult.value.rows
		}, 200);
});

function validateBody(body: Body): ValidationResult {
	if (!body.name)
		return { valid: false, message: "Missing 'name' prop in body" };

	if (!body.description)
		return { valid: false, message: "Missing 'description' prop in body" };

	return { valid: true };
}