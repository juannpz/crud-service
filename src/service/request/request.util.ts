import { Context } from "jsr:@hono/hono@4.7.8";
import { IContextVariables } from "./request.definition.ts";

export function buildAuthHeaders(token: string) {
    return { Authorization: `Bearer ${token}` };
}

export function reBuildAuthHeaders(req: Request) {
    return { Authorization: req.headers.get("Authorization") };
}

export function getContextVariables(context: Context<{ Variables: IContextVariables }>): IContextVariables {
   return context.var;
}