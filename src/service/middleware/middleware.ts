import { JWTManager } from "@juannpz/deno-server-tools";
import { IJWTPayload, keyGenerationConfig } from "../service.definition.ts";
import { Context } from "jsr:@hono/hono@4.7.2";

export async function basicAuthMiddleware(c: Context, next: () => Promise<void | Response>) {
    const token = c.req.header('Authorization');

    if (!token)
        return c.json({ message: 'Missing auth token' }, 401);

    if (!token.startsWith('Bearer '))
        return c.json({ message: 'Invalid auth token format' }, 401);

    const verificationResult = await JWTManager.verify<IJWTPayload>(token, keyGenerationConfig);

    if (!verificationResult.success) {
        console.error(verificationResult.message);

        return c.json({ message: verificationResult.message }, 401);
    };

    c.set('userId', verificationResult.data.userId);

    await next();
}