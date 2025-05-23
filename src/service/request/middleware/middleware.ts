import { IJWTPayload, keyGenerationConfig } from "../../service.definition.ts";
import { JWTManager } from "@juannpz/deno-service-tools";
import { Context } from "jsr:@hono/hono@4.7.8";

export async function basicAuthMiddleware(c: Context, next: () => Promise<void | Response>) {
    const token = c.req.header("Authorization");

    if (!token)
        return c.json({ message: "Missing auth token" }, 401);

    if (!token.startsWith("Bearer "))
        return c.json({ message: "Invalid auth token format" }, 401);

    const verificationResult = await JWTManager.verify<IJWTPayload>(token, keyGenerationConfig);

    if (!verificationResult.success) {
        console.error(verificationResult.message);

        return c.json({ message: verificationResult.message }, 401);
    };
    
    c.set("format", c.req.query("format"))

    await next();
}